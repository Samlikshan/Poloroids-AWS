const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  items:{type:Array},
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
  updatedAt: { type: Date, default: null },
});

const Orders = mongoose.model("orders", orderSchema);

module.exports = Orders;
