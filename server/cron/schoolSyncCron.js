// cron/schoolSyncCron.js
//
// 🆕 Automatic referral synchronization.
//
// This does NOT duplicate any sync logic — it just calls the existing
// `syncSchoolCrmReferrals` from services/schoolSync.service.js on a
// schedule, exactly the same function that POST /sync/school-crm/run
// already calls. That manual endpoint is untouched and still works if
// someone wants to trigger a sync on demand.

import cron from "node-cron";
import { syncSchoolCrmReferrals, SchoolSyncError } from "../services/schoolSync.service.js";

const CRON_SCHEDULE = "*/5 * * * *"; // every 5 minutes

// Simple in-process lock: if a sync run somehow takes longer than 5
// minutes (e.g. School CRM is slow), skip the next tick instead of
// letting two runs overlap and race each other.
let isSyncRunning = false;

const runScheduledSync = async () => {
  if (isSyncRunning) {
    console.warn("⏭️  [schoolSyncCron] Previous sync still running — skipping this tick.");
    return;
  }

  isSyncRunning = true;
  const startedAt = new Date().toISOString();

  try {
    const summary = await syncSchoolCrmReferrals();

    // 🆕 Required logging: created / updated / skipped / failed counts.
    console.log(
      `✅ [schoolSyncCron] ${startedAt} — School CRM referral sync completed | ` +
        `total: ${summary.total}, created: ${summary.created}, ` +
        `updated: ${summary.updated}, skipped: ${summary.skipped}, ` +
        `failed: ${summary.failed}`
    );

    if (summary.errors?.length > 0) {
      console.warn(`⚠️  [schoolSyncCron] ${summary.errors.length} record(s) had issues:`, summary.errors);
    }
  } catch (err) {
    // 🛡️ A failed run must never crash the process or cancel future
    // scheduled runs — node-cron keeps firing on schedule regardless of
    // whether this callback throws or resolves.
    if (err instanceof SchoolSyncError) {
      console.error(`❌ [schoolSyncCron] ${startedAt} — sync failed: ${err.message}`);
    } else {
      console.error(`❌ [schoolSyncCron] ${startedAt} — sync failed unexpectedly:`, err);
    }
  } finally {
    isSyncRunning = false;
  }
};

// 🟢 Call once from server.js at startup to register the schedule.
export const startSchoolSyncCron = () => {
  console.log(`🕒 [schoolSyncCron] Registered — runs every 5 minutes (${CRON_SCHEDULE}).`);

  // Run immediately on startup
  runScheduledSync().catch(console.error);

  // Then continue every 5 minutes
  cron.schedule(CRON_SCHEDULE, runScheduledSync);
};