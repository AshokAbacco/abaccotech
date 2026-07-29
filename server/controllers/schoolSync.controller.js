// controllers/schoolSync.controller.js
import { syncSchoolCrmReferrals, SchoolSyncError } from "../services/schoolSync.service.js";

// 🟢 POST /sync/school-crm/run (admin only)
// Pulls the current list of referred users from School CRM and upserts
// them into the Referral table. Safe to call repeatedly — the underlying
// service dedupes on (website, externalId), so re-running never creates
// duplicate rows, it just refreshes status/plan on existing ones.
//
// Trigger this manually from an admin panel button, or point a scheduled
// cron job at it (e.g. every 15 minutes) to fully replace the old
// push-based webhook flow.
export const runSchoolCrmSync = async (req, res) => {
  try {
    const summary = await syncSchoolCrmReferrals();

    return res.status(200).json({
      success: true,
      message: "School CRM referral sync completed.",
      data: summary,
    });
  } catch (err) {
    if (err instanceof SchoolSyncError) {
      return res.status(err.statusCode || 502).json({
        success: false,
        message: err.message,
      });
    }

    console.error("❌ School CRM sync error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while syncing referrals from School CRM.",
    });
  }
};