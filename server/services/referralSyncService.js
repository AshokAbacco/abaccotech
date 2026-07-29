// services/referralSyncService.js
import { PrismaClient } from "@prisma/client";
import { findVendorByReferralCode } from "./referralService.js";

const prisma = new PrismaClient();

const BOUNCE_CURE_API_BASE = process.env.BOUNCE_CURE_API_BASE_URL; // e.g. https://bounce-cure.onrender.com (backend-only, never a VITE_ var)
const BOUNCE_CURE_SYNC_KEY = process.env.BOUNCE_CURE_SYNC_API_KEY; // must match ABACCO_SYNC_API_KEY on Bounce Cure's side
const WEBSITE_LABEL = "Bounce Cure";

class SyncError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

// 🟢 Tracks the last successful sync so repeat runs only ask for what changed.
const getLastSyncedAt = async () => {
  const state = await prisma.syncState.findUnique({
    where: { key: "bounce_cure_referrals" },
  });
  return state?.value || null;
};

const setLastSyncedAt = async (isoString) => {
  await prisma.syncState.upsert({
    where: { key: "bounce_cure_referrals" },
    create: { key: "bounce_cure_referrals", value: isoString },
    update: { value: isoString },
  });
};

// 🟢 Pulls users from Bounce Cure who signed up using an Abacco Tech referral
// code, resolves each code to a vendor, and upserts into our Referral table.
export const syncBounceCureReferrals = async () => {
  if (!BOUNCE_CURE_API_BASE || !BOUNCE_CURE_SYNC_KEY) {
    throw new SyncError(
      "Bounce Cure sync is not configured — set BOUNCE_CURE_API_BASE_URL and BOUNCE_CURE_SYNC_API_KEY.",
      500
    );
  }

  const since = await getLastSyncedAt();
  const url = new URL("/api/internal/referrals/export", BOUNCE_CURE_API_BASE);
  if (since) url.searchParams.set("since", since);

  console.log(`🔗 Bounce Cure sync requesting: ${url.toString()}`);

  const response = await fetch(url, {
    headers: {
      "x-internal-api-key": BOUNCE_CURE_SYNC_KEY,
      "User-Agent": "AbaccoTech-Sync/1.0", // some WAFs/CDNs block requests with no/default User-Agent
    },
  });

  if (!response.ok) {
    // 🔎 Read whatever the upstream actually sent back — this is the key
    // diagnostic. A Cloudflare/Render block usually returns an HTML page or
    // a distinctive short message here, very different from a JSON 429 your
    // own Express code would produce. Also surface Retry-After if present.
    const retryAfter = response.headers.get("retry-after");
    // Log every response header — express-rate-limit normally attaches
    // RateLimit-Limit / RateLimit-Remaining / RateLimit-Policy (or the older
    // X-RateLimit-* names). Their presence/absence tells us whether this is
    // really express-rate-limit inside Bounce Cure's own code, or something
    // injected by Render/a CDN in front of it.
    const headerDump = {};
    response.headers.forEach((value, key) => {
      headerDump[key] = value;
    });

    let bodyPreview = "";
    try {
      bodyPreview = (await response.text()).slice(0, 500);
    } catch {
      bodyPreview = "(could not read response body)";
    }

    console.error(
      `❌ Bounce Cure export failed — status ${response.status}${
        retryAfter ? `, retry-after: ${retryAfter}` : ""
      }\nAll response headers:\n${JSON.stringify(headerDump, null, 2)}\nResponse body preview:\n${bodyPreview}`
    );

    throw new SyncError(
      `Bounce Cure export request failed (${response.status})`,
      502
    );
  }

  const { users = [] } = await response.json();

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let latestUpdatedAt = since;

  for (const remoteUser of users) {
    const referralCode = remoteUser.referredByCode;
    if (!referralCode) {
      skipped++;
      continue;
    }

    const vendor = await findVendorByReferralCode(referralCode);
    if (!vendor) {
      console.warn(
        `⚠️ No vendor found for referral code "${referralCode}" (Bounce Cure user ${remoteUser.id})`
      );
      skipped++;
      continue;
    }

    const phone = null; // Bounce Cure's User model has no phone field

    const fullName = [remoteUser.firstName, remoteUser.lastName].filter(Boolean).join(" ").trim();
    const userName = fullName || (remoteUser.email ? remoteUser.email.split("@")[0] : "Unknown");

    const data = {
      vendorId: vendor.id,
      referralCode,
      website: WEBSITE_LABEL,
      userName,
      email: remoteUser.email || null,
      phone,
      plan: remoteUser.plan || null,
      status: remoteUser.hasPurchasedBefore ? "PAID" : "TRIAL",
      externalId: String(remoteUser.id),
    };

    const existing = await prisma.referral.findUnique({
      where: {
        website_externalId: { website: WEBSITE_LABEL, externalId: data.externalId },
      },
    });

    if (existing) {
      await prisma.referral.update({ where: { id: existing.id }, data });
      updated++;
    } else {
      await prisma.referral.create({ data });
      created++;
    }

    if (!latestUpdatedAt || new Date(remoteUser.updatedAt) > new Date(latestUpdatedAt)) {
      latestUpdatedAt = remoteUser.updatedAt;
    }
  }

  if (latestUpdatedAt) {
    await setLastSyncedAt(latestUpdatedAt);
  }

  return { created, updated, skipped, total: users.length };
};

export { SyncError };