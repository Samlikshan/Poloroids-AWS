const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
    productName: String,
    unitPrice: Number,
    quantity: Number,
    totalPrice: Number,
    paymendStatus: String,
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled", "returned"],
      default: "pending",
    },
    returnStatus: {
      type: String,
      enum: ["none", "requested", "approved", "rejected"],
      default: "none",
    },
    returnReason: { type: String },
  },
  { timestamps: true }
);

const orderSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  items: [itemSchema],
  address: {
    addressId: { type: mongoose.Schema.Types.ObjectId },
    firstName: { type: String },
    lastName: { type: String },
    company: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    pincode: { type: String },
    phoneNumber: { type: String },
    email: { type: String },
  },
  totalAmount: { type: String },
  finalPrice: { type: String },
  paymentMethod: { type: String },
  paymentStatus: { type: String },
  orderStatus: { type: String },
  createdAt: { type: Date },
  couponCode: { type: String, default: null },
  couponDiscountPercentage: { type: Number, default: null },
  updatedAt: { type: Date, default: null },
});

const Orders = mongoose.model("orders", orderSchema);

module.exports = Orders;
