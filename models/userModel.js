const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  googleId: { type: String,unique:true },
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: { type: String },
  phoneNumber:{type:String},
  address: [
    {
      addressId: { type: mongoose.Schema.Types.ObjectId, ref: "address id" },
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
      addressType: { type: String },
      addedAt:{type:Date,default:Date.now}
    },
  ],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
});
const User = mongoose.model("users", userSchema);
module.exports = User;
