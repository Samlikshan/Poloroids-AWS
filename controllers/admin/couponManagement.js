const Coupons = require("../../models/couponModel");

const viewCoupons = async (req, res) => {
  const coupons = await Coupons.find().sort({ createdAt: -1 });
  res.render("admin/coupons", { coupons });
};

const postCoupon = async (req, res) => {
  let {
    couponCode,
    discountValue,
    minPurchase,
    maxPurchase,
    expiryDate,
    status,
  } = req.body;
  discountValue = parseFloat(discountValue);
  minPurchase = parseFloat(minPurchase);
  maxPurchase = parseFloat(maxPurchase);
  expiryDate = new Date(expiryDate);
  status = status === "active";

  await Coupons.create({
    couponCode,
    discountValue,
    minPurchase,
    maxPurchase,
    expiryDate,
    status,
  });
  res.redirect("/admin/coupons");
};

const applyCoupon = async (req, res) => {
  const { couponCode, subtotalAmount } = req.body;
  const coupon = await Coupons.findOne({ couponCode: couponCode });
  console.log(coupon)
  if (!coupon) {
    return res.status(400).json({ error: "Invalid Coupon code" });
  }
  if (!coupon.status) {
    return res.status(400).json({ error: "Invalid Coupon code" });
  }
  if(subtotalAmount<coupon.minPurchase){
    return res.status(400).json({ error: "Min Purchase limit not meeted" });
  }
  if(subtotalAmount>coupon.maxPurchase){
    return res.status(400).json({ error: "Max Purchase limit Exeeded" });
  }
  req.session.coupon = coupon
  return res.status(200).json({coupon})
  
};

module.exports = {
  viewCoupons,
  postCoupon,
  applyCoupon,
};
