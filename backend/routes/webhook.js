import express from "express";
import { stripe } from "../config/stripe.js";
import UserPlan from "../models/UserPlan.js";

const router = express.Router();

router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ PAYMENT SUCCESS EVENT
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const userId = session.metadata.userId;
    const plan = session.metadata.plan;

    await UserPlan.findOneAndUpdate(
      { userId },
      { plan },
      { upsert: true }
    );
  }

  res.json({ received: true });
});

export default router;