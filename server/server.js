// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import paymentRoute from "./routes/payment.js";
import vendorRoute from "./routes/vendor.js";
import authRoute from "./routes/auth.js";
import referralRoutes from "./routes/referral.js";
import { startBounceCureSyncCron } from "./cron/bounceCureSyncCron.js";

dotenv.config();

const app = express();

// 🌍 Allowed Frontend Origins
const allowedOrigins = [
  "https://abaccotech.com",          // Live domain
  "https://www.abaccotech.com",      // Live domain with www
  "https://abaccotech-1.onrender.com", // Render frontend (if used)

  "http://localhost:5173",           // Your Vite frontend (correct one)
  "http://127.0.0.1:5173"            // Alternate localhost
];

// 🔥 CORS Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow mobile apps / curl / postman (no origin)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Parse JSON
app.use(express.json());

// 🖼️ Serve uploaded vendor files (images/pdfs/docs) statically
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// 🟢 Test Route
app.get("/", (req, res) => {
  res.send("✅ Backend Running — CORS Working!");
});

// 🟢 Auth Routes (register / login / me)
app.use("/auth", authRoute);

// 🟢 Payment Routes
app.use("/payment", paymentRoute);

// 🟢 Vendor Routes
app.use("/vendor", vendorRoute);

app.use("/referral", referralRoutes);
// 🟢 Start Server

startBounceCureSyncCron();

app.listen(5001, () => {
  console.log("🚀 Backend running on http://localhost:5001");
});
