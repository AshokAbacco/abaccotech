// cron/bounceCureSyncCron.js
//
// Requires the `node-cron` package: npm install node-cron

import cron from "node-cron";
import { syncBounceCureReferrals } from "../services/referralSyncService.js";

// Runs every 15 minutes. Adjust the schedule to match how quickly new Bounce
// Cure signups need to show up on the Vendors page.
export const startBounceCureSyncCron = () => {
  cron.schedule("*/15 * * * *", async () => {
    try {
      const result = await syncBounceCureReferrals();
      console.log("🔄 Bounce Cure referral sync:", result);
    } catch (err) {
      console.error("❌ Bounce Cure referral sync failed:", err.message);
    }
  });
};

/*
 * Wiring into server.js:
 *
 *   import { startBounceCureSyncCron } from "./cron/bounceCureSyncCron.js";
 *   ...
 *   startBounceCureSyncCron();
 *
 * And add to Abacco Tech's .env:
 *   BOUNCE_CURE_API_BASE_URL=http://localhost:5000
 *   BOUNCE_CURE_SYNC_API_KEY=<same shared secret as ABACCO_SYNC_API_KEY on Bounce Cure>
 */