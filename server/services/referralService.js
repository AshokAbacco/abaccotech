// services/referralService.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🟢 Custom error helper so the controller can map these to the right HTTP status
class ReferralError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// 🟢 A vendor's referral code actually lives on their User record (User.referralCode),
// not on the Vendor row itself — so resolving a code means: find the User, then their Vendor.
export const findVendorByReferralCode = async (referralCode) => {
  const user = await prisma.user.findUnique({
    where: { referralCode },
    include: { vendor: true },
  });

  if (!user || !user.vendor) {
    return null;
  }

  return user.vendor;
};

// 🟢 POST /referral/register — called by external projects (Bounce Cure, School CRM, etc.)
export const registerReferral = async ({
  referralCode,
  website,
  userName,
  email,
  phone,
  plan,
}) => {
  const vendor = await findVendorByReferralCode(referralCode);
  if (!vendor) {
    throw new ReferralError("Invalid Referral Code", 404);
  }

  // 🔒 Prevent duplicate referrals using the same phone number for the same website
  const duplicate = await prisma.referral.findFirst({
    where: { website, phone },
  });
  if (duplicate) {
    throw new ReferralError(
      "This phone number has already been referred for this website.",
      409
    );
  }

  const referral = await prisma.referral.create({
    data: {
      vendorId: vendor.id,
      referralCode,
      website,
      userName,
      email: email || null,
      phone,
      plan: plan || null,
    },
  });

  return referral;
};

// 🟢 GET /referral/vendor/:vendorId — all referrals for a vendor, newest first
export const getReferralsByVendor = async (vendorId) => {
  const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
  if (!vendor) {
    throw new ReferralError("Vendor not found", 404);
  }

  return prisma.referral.findMany({
    where: { vendorId },
    orderBy: { createdAt: "desc" },
  });
};

// 🟢 GET /referral/stats/:vendorId
export const getReferralStats = async (vendorId) => {
  const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
  if (!vendor) {
    throw new ReferralError("Vendor not found", 404);
  }

  const [totalReferrals, activeUsers, paidUsers, trialUsers] = await Promise.all([
    prisma.referral.count({ where: { vendorId } }),
    prisma.referral.count({ where: { vendorId, status: "ACTIVE" } }),
    prisma.referral.count({ where: { vendorId, status: "PAID" } }),
    prisma.referral.count({ where: { vendorId, status: "TRIAL" } }),
  ]);

  return { totalReferrals, activeUsers, paidUsers, trialUsers };
};

// 🟢 Powers the Vendor Details page: vendor info + stats + referral list in one call
export const getVendorDetails = async (vendorId) => {
  const vendor = await prisma.vendor.findUnique({
    where: { id: vendorId },
    include: {
      files: true,
      user: {
        select: { username: true, email: true, referralCode: true },
      },
    },
  });

  if (!vendor) {
    throw new ReferralError("Vendor not found", 404);
  }

  // vendor is guaranteed to exist here, so we can fetch stats/referrals directly
  // instead of going through the vendor-existence check twice.
  const [totalReferrals, activeUsers, paidUsers, trialUsers, referrals] = await Promise.all([
    prisma.referral.count({ where: { vendorId } }),
    prisma.referral.count({ where: { vendorId, status: "ACTIVE" } }),
    prisma.referral.count({ where: { vendorId, status: "PAID" } }),
    prisma.referral.count({ where: { vendorId, status: "TRIAL" } }),
    prisma.referral.findMany({ where: { vendorId }, orderBy: { createdAt: "desc" } }),
  ]);

  return {
    vendor,
    stats: { totalReferrals, activeUsers, paidUsers, trialUsers },
    referrals,
  };
};

// 🆕 GET /referral/me — powers VendorsList.jsx for the logged-in vendor.
// The frontend only has a JWT (req.user.userId), not a vendorId, so we resolve
// user -> vendor here instead of making the client guess/store the vendor id.
export const getVendorDetailsByUserId = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { vendor: { select: { id: true } } },
  });

  if (!user || !user.vendor) {
    // Not a hard error for the frontend — just means "no KYC submitted yet"
    throw new ReferralError("No vendor profile found for this account.", 404);
  }

  return getVendorDetails(user.vendor.id);
};

export { ReferralError };