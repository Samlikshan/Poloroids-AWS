const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const couponSchema = new Schema({
    couponCode:{type:String},
    discountValue:{type:Number},
    minPurchase:{type:Number},
    maxPurchase:{type:Number},
    expiryDate:{type:Date},
    status:{type:Boolean},
    createdAt:{type:Date,default:Date.now}
});

couponSchema.index({ expiryDate: 1 }, { expireAfterSeconds: 0 });
const Coupons = mongoose.model("coupons", couponSchema);
module.exports = Coupons;
