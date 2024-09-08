const User = require("../../models/userModel");
const Cart = require("../../models/shoppingCartModel");
const Product = require("../../models/productModel");
const Order = require("../../models/orderModel");
const jwt = require("jsonwebtoken");



const viewCheckout = async (req, res) => {
  const token = req.cookies["Token"];
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  const user = await User.findOne({ username: decoded.username });
  const cart = await Cart.findOne({ userId: user._id });
  const productPromises = cart.items.map(async (item) => {
    const product = await Product.findById(item.productId);
    return {
      ...product.toObject(),
      quantity: item.quantity,
    };
  });
  const products = await Promise.all(productPromises);
  // console.log(user, cart, products);
  res.render("user/checkout", { user, products });
};

const postCheckout = async (req, res) => {
  console.log(req.body.address)
  try {
    const token = req.cookies["Token"];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({ username: decoded.username });
    const order = new Order({
      userId: user._id,
      items: req.body.items,
      address: req.body.address,
      paymentMethod: req.body.paymentMethod,
      totalAmount: req.body.totalAmount,
      paymentStatus: "pending",
      orderStatus: 'pending',
      createdAt: Date.now(),
    });

    // Validate and update product stock
    for (const item of req.body.items) {
      const product = await Product.findById(item.productId);

      if (product.stock === 0) {
        return res.status(400).json({ message: 'Product Sold out' });
      } else if (item.quantity > product.stock) {
        return res.status(400).json({ message: 'Insufficient stock, please consider reducing the quantity' });
      } else {
        await Product.updateOne({ _id: item.productId }, { $inc: { stock: -item.quantity } });
      }
    }

    // Clear the cart after processing items
    await Cart.updateOne({ userId: user._id }, { $set: { items: [] } });

    // Save the order
    await order.save();
    res.status(200).json({ message: 'Order placed successfully' });

  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const successPage = (req,res)=>{
  res.render('user/successPage')
}

module.exports = { viewCheckout, postCheckout, successPage };
