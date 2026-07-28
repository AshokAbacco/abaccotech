// services/referralSyncService.js
import { PrismaClient } from "@prisma/client";
import { findVendorByReferralCode } from "./referralService.js";

const prisma = new PrismaClient();

const BOUNCE_CURE_API_BASE = process.env.BOUNCE_CURE_API_BASE_URL; // e.g. http://localhost:5000 (backend-only, never a VITE_ var)
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
// Safe to run repeatedly — matching rows are updated in place, never
// duplicated (keyed on externalId, since Bounce Cure has no phone field).
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

  const response = await fetch(url, {
    headers: { "x-internal-api-key": BOUNCE_CURE_SYNC_KEY },
  });

  if (!response.ok) {
    throw new SyncError(`Bounce Cure export request failed (${response.status})`, 502);
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

    // Bounce Cure has no phone field — leave it null for these rows.
    const phone = null;

    // Bounce Cure DOES have firstName/lastName — use them; fall back to the
    // email's local part only if both are missing.
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