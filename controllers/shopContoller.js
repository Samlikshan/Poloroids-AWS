const jwt = require('jsonwebtoken')
const User =  require('../models/userModel')
const Product = require("../models/productModel");

const Brand = require("../models/brandModel");
const Type = require("../models/typeModel");
const Gear = require("../models/gearModel");
const Wishlist = require("../models/wishlistModel");

const Offer = require('../models/offerModel')
const Cart = require('../models/shoppingCartModel')

const getProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page
  const limit = 6; // Number of products per page
  const skip = (page - 1) * limit;

  // Fetch total product count and the products for the current page
  const totalProducts = await Product.countDocuments({ availability: true });
  const totalPages = Math.ceil(totalProducts / limit);

  const products = await Product.find({ availability: true })
    .skip(skip)
    .limit(limit);
  
  const brands = await Brand.find({ isActive: true });
  const types = await Type.find({ isActive: true });
  const gears = await Gear.find({ isActive: true });
  const offers = await Offer.find({ status: true }).populate('typeId');

  const currentDate = new Date();

  products.forEach(product => {
    // Filter for applicable offers
    const applicableOffers = offers.filter(offer => {
      const isValidOffer = currentDate >= new Date(offer.validFrom) && currentDate <= new Date(offer.validTo);
      return isValidOffer && (
        (offer.offerType === "brand" && offer.typeId.categoryName === product.brand) || // Brand-based offer
        (offer.offerType === "product" && offer.typeId._id.toString() === product._id.toString()) // Product-based offer
      );
    });

    if (applicableOffers.length > 0) {
      // Find the best offer (with the highest discount percentage)
      const bestOffer = applicableOffers.reduce((maxOffer, currentOffer) => {
        return currentOffer.discountPercentage > maxOffer.discountPercentage ? currentOffer : maxOffer;
      });

      // Calculate final price using the best offer
      product.finalPrice = Math.ceil(product.price - (product.price * bestOffer.discountPercentage / 100));
      product.offer = bestOffer;
    } else {
      product.finalPrice = product.price; // No offers, so final price is the original price
    }
  });

  const token = req.cookies["Token"];
  if (!token) {
    return res.render("user/shop", {
      products,
      brands,
      types,
      gears,
      currentPage: page,
      totalPages
    });
  }



  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  const user = await User.findOne({ username: decoded.username });
  let wishlist 
  let cart
  if(user){
    wishlist = await Wishlist.findOne({ userId: user._id });
    cart = await Cart.findOne({userId:user._id})
  }

  return res.render("user/shop", {
    products,
    brands,
    types,
    gears,
    wishlist,
    currentPage: page,
    totalPages,
    cart
  });
};


const sortProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 6;
  const skip = (page - 1) * limit;

  let products = await Product.find({ availability: true });
  const totalProducts = await Product.countDocuments({ availability: true });
  const totalPages = Math.ceil(totalProducts / limit);

  const order = req.params.order;
  switch (order) {
    case "name_asc":
      products = await Product.find({ availability: true })
        .sort({ productName: 1 })
        .skip(skip)
        .limit(limit);
      break;
    case "name_desc":
      products = await Product.find({ availability: true })
        .sort({ productName: -1 })
        .skip(skip)
        .limit(limit);
      break;
    case "price_asc":
      products = await Product.find({ availability: true })
        .sort({ price: 1 })
        .skip(skip)
        .limit(limit);
      break;
    case "price_desc":
      products = await Product.find({ availability: true })
        .sort({ price: -1 })
        .skip(skip)
        .limit(limit);
      break;
    default:
      products = await Product.find({ availability: true }).skip(skip).limit(limit);
  }

  const brands = await Brand.find({ isActive: true });
  const types = await Type.find({ isActive: true });
  const gears = await Gear.find({ isActive: true });
  const offers = await Offer.find({ status: true });

  res.render("user/shop", {
    products,
    brands,
    types,
    gears,
    offers,
    currentPage: page,
    totalPages
  });
};


module.exports = {
  getProducts,
  sortProducts,
};
