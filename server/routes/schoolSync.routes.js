// routes/schoolSync.routes.js
import express from "express";
import { runSchoolCrmSync } from "../controllers/schoolSync.controller.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🟢 POST /sync/school-crm/run (admin only) — pulls referred users from
// School CRM (GET /api/payment/referrals) and upserts them into the
// Referral table. Replaces the old push-based POST /referral/register
// calls that School CRM used to make on every payment event.
router.post("/run", protect, requireAdmin, runSchoolCrmSync);

export default router;