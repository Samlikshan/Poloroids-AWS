const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const walletSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  balance: { type: Number },
  transactions: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
      amount: { type: Number },
      transactionType: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
});
const Wallet = mongoose.model("wallet", walletSchema);
module.exports = Wallet;
