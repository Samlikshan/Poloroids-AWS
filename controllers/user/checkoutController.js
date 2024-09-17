const User = require("../../models/userModel");
const Cart = require("../../models/shoppingCartModel");
const Product = require("../../models/productModel");
const Order = require("../../models/orderModel");
const jwt = require("jsonwebtoken");
const Offer = require('../../models/offerModel')


const viewCheckout = async (req, res) => {
  let coupon;
  const token = req.cookies["Token"];
  
  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  const user = await User.findOne({ username: decoded.username });

  if (!user) {
    return res.status(404).send("User not found");
  }

  const cart = await Cart.findOne({ userId: user._id });
  
  if (!cart || cart.items.length === 0) {
    return res.status(400).send("Cart is empty");
  }

  try {
    // Fetch products and apply any applicable offers
    const productPromises = cart.items.map(async (item) => {
      const product = await Product.findById(item.productId);

      // Fetch product-specific offer
      const productOffer = await Offer.findOne({
        typeId: product._id,
        offerType: 'product',
        validFrom: { $lte: new Date() },
        validTo: { $gte: new Date() },
        status: true
      });

      // Fetch brand-specific offer and populate `typeId`
      const brandOffer = await Offer.findOne({
        offerType: 'brand',
        validFrom: { $lte: new Date() },
        validTo: { $gte: new Date() },
        status: true
      }).populate('typeId'); // Populating `typeId` for brand offer

      // Check if the populated brandOffer's `categoryName` matches the product's `brand`
      let finalBrandOffer = null;
      if (brandOffer && brandOffer.typeId && brandOffer.typeId.categoryName === product.brand) {
        finalBrandOffer = brandOffer;
      }

      // Calculate the final price based on the highest discount offer
      let price = product.price;
      if (productOffer && finalBrandOffer) {
        // Choose the offer with the higher discount percentage
        const maxDiscount = Math.max(productOffer.discountPercentage, finalBrandOffer.discountPercentage);
        price = Math.ceil(product.price - (product.price * maxDiscount / 100));
      } else if (productOffer) {
        price = Math.ceil(product.price - (product.price * productOffer.discountPercentage / 100));
      } else if (finalBrandOffer) {
        price = Math.ceil(product.price - (product.price * finalBrandOffer.discountPercentage / 100));
      }

      return {
        ...product.toObject(),
        price, // Final price after applying the offer
        quantity: item.quantity
      };
    });

    const products = await Promise.all(productPromises);

    // Check if there's a coupon applied in the session
    if (req.session.coupon) {
      coupon = req.session.coupon;
    }

    // Render checkout page with user, products (with final prices), and coupon info
    res.render("user/checkout", { user, products, coupon });
    
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
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
      finalPrice: req.body.finalPrice,
      paymentStatus: req.body.paymentStatus,
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
