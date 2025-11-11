import express from "express";
import Razorpay from "razorpay";
import cors from "cors";

const app = express();

// ✅ CORS first
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

// ✅ Allow JSON
app.use(express.json());

// Razorpay instance
const razorpay = new Razorpay({
  key_id: "rzp_live_ReYUWfeZHoe7IE",
  key_secret: "I9mZp6FEPB3fErcMGx3jImQA"
});

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Razorpay backend running ✅");
});

// ✅ Create order route
app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });
    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(5000, () => {
  console.log("✅ Backend running on http://localhost:5000");
});
