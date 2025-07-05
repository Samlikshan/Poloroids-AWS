const mongoose = require("mongoose");

const paymentSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, require: true },
    rzr_order_id: { type: String, required: true },
    status: {
      type: String,
      enum: ["completed", "pending", "cancelled", "expired", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const paymentSessionModel = mongoose.model(
  "PaymentSession",
  paymentSessionSchema
);

module.exports = paymentSessionModel;
