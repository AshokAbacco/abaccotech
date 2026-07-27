// routes/referral.js
import express from "express";
import * as referralController from "../controllers/referralController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🟢 Called by external projects (Bounce Cure, School CRM, etc.) when a user
// registers there using a vendor's referral code. Intentionally public/unauthenticated
// since the caller is another server, not a logged-in Abacco Tech user.
router.post("/register", referralController.registerReferral);

// 🆕 GET /referral/me (protected) — the logged-in vendor's own details + stats +
// referral list, resolved from the JWT. Powers VendorsList.jsx.
router.get("/me", protect, referralController.getMyVendorDetails);

// 🟢 All referred users for a vendor, newest first
router.get("/vendor/:vendorId", referralController.getVendorReferrals);

// 🟢 Aggregate counts (total / active / paid / trial) for a vendor
router.get("/stats/:vendorId", referralController.getVendorStats);

// 🟢 Combined payload for the Vendor Details page: vendor info + stats + referrals
router.get("/details/:vendorId", referralController.getVendorDetails);

export default router;