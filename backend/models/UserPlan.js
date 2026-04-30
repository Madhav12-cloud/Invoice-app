import mongoose from "mongoose";

const userPlanSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  plan: { type: String, default: "starter" },
  invoiceCount: { type: Number, default: 0 },
});

export default mongoose.model("UserPlan", userPlanSchema);