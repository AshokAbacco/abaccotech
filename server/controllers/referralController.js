// controllers/referralController.js
import * as referralService from "../services/referralService.js";

// ✅ Basic validators, kept in the same lenient style used elsewhere in the project
const isValidPhone = (val) => /^\d{7,15}$/.test(val);
const isValidEmail = (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

// 🟢 POST /referral/register
export const registerReferral = async (req, res) => {
  try {
    const { referralCode, website, userName, email, phone, plan } = req.body;

    if (!referralCode) {
      return res
        .status(400)
        .json({ success: false, message: "Referral code is required." });
    }
    if (!website) {
      return res
        .status(400)
        .json({ success: false, message: "Website is required." });
    }
    if (!userName) {
      return res
        .status(400)
        .json({ success: false, message: "User name is required." });
    }
    if (!phone) {
      return res
        .status(400)
        .json({ success: false, message: "Phone is required." });
    }
    if (!isValidPhone(phone)) {
      return res
        .status(400)
        .json({ success: false, message: "Phone number format is invalid." });
    }
    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Email format is invalid." });
    }

    const referral = await referralService.registerReferral({
      referralCode,
      website,
      userName,
      email,
      phone,
      plan,
    });

    return res.status(201).json({
      success: true,
      message: "Referral saved successfully",
      data: referral,
    });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    console.error("❌ Referral registration error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while saving the referral.",
    });
  }
};

// 🟢 GET /referral/vendor/:vendorId
export const getVendorReferrals = async (req, res) => {
  try {
    const vendorId = Number(req.params.vendorId);
    if (Number.isNaN(vendorId)) {
      return res.status(400).json({ success: false, message: "Invalid vendor id." });
    }

    const referrals = await referralService.getReferralsByVendor(vendorId);

    return res.status(200).json({
      success: true,
      message: "Referrals fetched successfully",
      data: referrals,
    });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    console.error("❌ Get vendor referrals error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching referrals.",
    });
  }
};

// 🟢 GET /referral/stats/:vendorId
export const getVendorStats = async (req, res) => {
  try {
    const vendorId = Number(req.params.vendorId);
    if (Number.isNaN(vendorId)) {
      return res.status(400).json({ success: false, message: "Invalid vendor id." });
    }

    const stats = await referralService.getReferralStats(vendorId);

    return res.status(200).json({
      success: true,
      message: "Referral stats fetched successfully",
      data: stats,
    });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    console.error("❌ Get vendor stats error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching referral stats.",
    });
  }
};

// 🟢 GET /referral/details/:vendorId — powers the Vendor Details page
// (vendor info + referral stats + referral list, in one response)
export const getVendorDetails = async (req, res) => {
  try {
    const vendorId = Number(req.params.vendorId);
    if (Number.isNaN(vendorId)) {
      return res.status(400).json({ success: false, message: "Invalid vendor id." });
    }

    const details = await referralService.getVendorDetails(vendorId);

    return res.status(200).json({
      success: true,
      message: "Vendor details fetched successfully",
      data: details,
    });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    console.error("❌ Get vendor details error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching vendor details.",
    });
  }
};

// 🆕 GET /referral/me (protected) — powers VendorsList.jsx.
// Resolves the vendor from the logged-in user's JWT (req.user.userId) so the
// frontend never has to know or store its own vendorId.
export const getMyVendorDetails = async (req, res) => {
  try {
    const details = await referralService.getVendorDetailsByUserId(req.user.userId);

    return res.status(200).json({
      success: true,
      message: "Vendor details fetched successfully",
      data: details,
    });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    console.error("❌ Get my vendor details error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching your vendor details.",
    });
  }
};