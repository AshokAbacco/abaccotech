// controllers/referralSyncController.js
import { syncBounceCureReferrals } from "../services/referralSyncService.js";

// 🟢 POST /referral/sync/bounce-cure (admin only)
// Manually triggers a pull from Bounce Cure — useful right after a known
// signup, or as an "on-demand refresh" button. The recurring sync is driven
// automatically by cron/bounceCureSyncCron.js.
export const runBounceCureSync = async (req, res) => {
  try {
    const result = await syncBounceCureReferrals();
    return res.status(200).json({ success: true, message: "Sync complete", data: result });
  } catch (err) {
    const statusCode = err.statusCode || 500;
    console.error("❌ Bounce Cure sync error:", err);
    return res.status(statusCode).json({ success: false, message: err.message || "Sync failed" });
  }
};