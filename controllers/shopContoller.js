const jwt = require('jsonwebtoken')
const User =  require('../models/userModel')
const Product = require("../models/productModel");

const Brand = require("../models/brandModel");
const Type = require("../models/typeModel");
const Gear = require("../models/gearModel");
const Wishlist = require("../models/wishlistModel");

const Offer = require('../models/offerModel')

const getProducts = async (req, res) => {
  const products = await Product.find({ availability: true });
  const brands = await Brand.find({ isActive: true });
  const types = await Type.find({ isActive: true });
  const gears = await Gear.find({ isActive: true });
  const offers = await Offer.find({status:true}).populate('typeId')
  
  products.forEach(product => {
    const applicableOffers = offers.filter(offer =>
      offer.typeId._id.toString() === product._id.toString() ||
      offer.typeId.categoryName === product.brand
    );

    if (applicableOffers.length > 0) {
      const bestOffer = applicableOffers.reduce((maxOffer, currentOffer) =>
        currentOffer.discountPercentage > maxOffer.discountPercentage ? currentOffer : maxOffer
      );

      // Calculate the price after the offer
      product.finalPrice = Math.ceil(product.price - (product.price * bestOffer.discountPercentage / 100));
      product.offer = bestOffer;
    } else {
      // No offer, final price is the same as the original price
      product.finalPrice = product.price;
    }
  });
  const token = req.cookies["Token"];
  if (!token) {
    return res.render("user/shop", { products, brands, types, gears });
  }
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  const user = await User.findOne({ username: decoded.username });
  const wishlist = await Wishlist.findOne({ userId: user._id });
  // console.log(products,brands,'brand and products')

  return res.render("user/shop", { products, brands, types, gears, wishlist});
};

const sortProducts = async (req, res) => {
  console.log(req.params.order);
  const order = req.params.order;
  let products = await Product.find({ availability: true });
  switch (order) {
    case "name_asc":
      products = await Product.find({ availability: true }).sort({
        productName: 1,
      });
      break;
    case "name_desc":
      products = await Product.find({ availability: true }).sort({
        productName: -1,
      });
      break;
    case "price_asc":
      products = await Product.find({ availability: true }).sort({ price: 1 });
      break;
    case "price_desc":
      products = await Product.find({ availability: true }).sort({ price: -1 });
      break;
    default:
      sortOption = {};
  }
  const brands = await Brand.find({ isActive: true });
  const types = await Type.find({ isActive: true });
  const gears = await Gear.find({ isActive: true });
  const offers = await Offer.find({status:true})
  res.render("user/shop", { products, brands, types, gears,offers });
};

module.exports = {
  getProducts,
  sortProducts,
};
