const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  // itemsCount: { type: Number, default: 1 },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "product id" },
      quantity: { type: Number, default: 1 },
      addedAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: null },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
});

const Cart = mongoose.model("cart", cartSchema);

module.exports = Cart;
