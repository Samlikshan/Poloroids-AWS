const User = require("../../models/userModel");
const Product = require("../../models/productModel");
const Order = require("../../models/orderModel");
const jwt = require("jsonwebtoken");
const Orders = require("../../models/orderModel");

const viewOrders = async (req, res) => {
  const token = req.cookies["Token"];
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  const user = await User.findOne({ username: decoded.username });
  const orders = await Orders.find({ userId: user._id })
    .populate("items")
    .sort({ createdAt: -1 });
  const products = await Product.find();
  // Assuming orders and products are already defined arrays

  // Update orders array with mainImage for each item
  orders.forEach((order) => {
    order.items.forEach((item) => {
      const productIdStr = String(item.productId);
      const product = products.find(
        (product) => String(product._id) === productIdStr
      );
      item.mainImage = product ? product.mainImage : null; // or some default value
    });
  });

  res.render("user/orderPage", { orders });
};

const singleOrder = async (req, res) => {
   const orderId = req.params.orderId
   const order = await Orders.findById(orderId)
  .populate("items")
  const user = await User.findOne({_id:order.userId},{address:0});
  const products = await Product.find();
  // Assuming orders and products are already defined arrays

  // Update orders array with mainImage for each item
    order.items.forEach((item) => {
      const productIdStr = String(item.productId);
      const product = products.find(
        (product) => String(product._id) === productIdStr
      );
      item.mainImage = product ? product.mainImage : null; // or some default value
    });
   res.render('user/orderDetails',{order,user})
};

const cancelOrder = async (req,res) => {
  try{
    const orderId = req.params.orderId
    await Orders.updateOne({_id:orderId},{$set:{orderStatus:'returned'}})
    return res.status(200).json({success:true,message:'order cancelled successfully'})
  }catch(error){
    console.log(error,'catch error')
  }
}

module.exports = {
  viewOrders,
  singleOrder,
  cancelOrder
};
