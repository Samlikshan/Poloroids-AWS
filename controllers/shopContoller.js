const Product = require("../models/productModel");
// const Category = require('../models/categoryModel')\
const Brand = require("../models/brandModel");
const Type = require("../models/typeModel");
const Gear = require("../models/gearModel");

const getProducts = async (req, res) => {
  const products = await Product.find({ availability: true });
  const brands = await Brand.find({ isActive: true });
  const types = await Type.find({ isActive: true });
  const gears = await Gear.find({ isActive: true });
  // const categories = await Category.find()
  res.render("user/shop", { products, brands, types, gears });
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
  res.render("user/shop", { products, brands, types, gears });
};

module.exports = {
  getProducts,
  sortProducts,
};
