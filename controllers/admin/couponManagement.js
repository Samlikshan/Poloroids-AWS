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
  const existCoupon = await Coupons.findOne({ couponCode: couponCode });
  if (existCoupon) {
    return res.status(409).json({ message: "Coupon already exists." });
  }
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
  // res.redirect("/admin/coupons");
  res.status(200).json("coupon created");
};

const applyCoupon = async (req, res) => {
  const { couponCode, subtotalAmount } = req.body;
  const coupon = await Coupons.findOne({ couponCode: couponCode , status:true });
  console.log(coupon);
  if (!coupon) {
    return res.status(400).json({ error: "Invalid Coupon code" });
  }
  if (!coupon.status) {
    return res.status(400).json({ error: "Invalid Coupon code" });
  }
  if (subtotalAmount < coupon.minPurchase) {
    return res.status(400).json({ error: "Min Purchase limit not meeted" });
  }
  if (subtotalAmount > coupon.maxPurchase) {
    return res.status(400).json({ error: "Max Purchase limit Exeeded" });
  }
  req.session.coupon = coupon;
  return res.status(200).json({ coupon });
};

const deleteCoupon = async (req, res) => {
  try {
    const { couponId } = req.body;
    await Coupons.deleteOne({ _id: couponId });
    res.status(200).json("coupon deleted successfully");
  } catch (error) {
    console.log(error, "error deleting coupon");
  }
};

const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupons.find({ status: true });
    res.render("user/coupons",{coupons});
  } catch (error) {
    console.log(error, "error fetching coupons");
  }
};

module.exports = {
  viewCoupons,
  postCoupon,
  applyCoupon,
  deleteCoupon,
  getCoupons,
};
