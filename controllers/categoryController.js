require("dotenv").config();
const Admin = require("../models/adminModel");
// const Category = require('../models/categoryModel')
const Brand = require("../models/brandModel");
const Gear = require("../models/gearModel");
const Type = require("../models/typeModel");

const categories = async (req, res, next) => {
  // let categories = await Category.find({})
  let brand = await Brand.find();
  let gear = await Gear.find();
  let type = await Type.find();
  res.render("admin/categories", { brand, gear, type });
};

const changeCategoryStatus = async (req, res) => {
  let Model;
  if (req.body.categoryType == "Brand") Model = Brand;
  else if (req.body.categoryType == "Type") Model = Type;
  else if (req.body.categoryType == "Gear") Model = Gear;
  else
    return res
      .status(400)
      .json({ success: false, message: "Invalid categoryType" });

  const category = await Model.findById({ _id: req.body.id });
  if (!category)
    return res
      .status(404)
      .json({ success: false, message: "Category not found" });

  const newStatus = !category.isActive;
  await Model.updateOne(
    { _id: req.body.id },
    { $set: { isActive: newStatus } }
  );

  res.status(200).json({ success: true, newStatus });
};

// const getEditCategories = async (req,res,next) => {
//     let id = req.params.id
//     let category = await Category.findById({_id:id})
//     console.log(category);

//     res.render('editCategory',category)
// }

// const postEditCategories = async (req,res,next) => {
//     let {categoryName,subCategories} = req.body
//     if(subCategories == undefined){
//         subCategories = []
//     }
//     let id = req.params.id
//     await Category.updateOne({_id:id},{$set:{categoryName:categoryName,subCategories:subCategories,updatedAt:Date()}})
//     res.redirect('/admin/categories')
// }

// const getAddCategory = async (req,res,next) =>{
//     res.render('addCategory')
// }

// const postAddCategory = async (req,res,next) => {
//     let category = req.body

//     await Category.create({categoryName:category.categoryName,subCategories:category.subCategories})
//     res.redirect('/admin/categories')
// }
const addCategory = async (req, res) => {
  try {
    const { categoryType, categories } = req.body;
    if (!categoryType || !Array.isArray(categories)) {
      return res.status(400).send("Invalid data");
    }

    let Model;
    if (categoryType === "Brand") Model = Brand;
    else if (categoryType === "Type") Model = Type;
    else if (categoryType === "Gear") Model = Gear;
    else return res.status(400).send("Invalid category type");

    // Check for duplicates
    const existing = await Model.find({
      categoryName: { $in: categories.map((c) => c.categoryName) },
    });
    if (existing.length > 0) {
      return res.status(409).json({ message: "category already exist" });
    }

    // Insert
    const inserted = await Model.insertMany(categories);
    res.status(201).json({ success: true, newCategories: inserted });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).send("Server error");
  }
};

const editCategory = async (req, res) => {
  try {
    const { id, categoryName, categoryType } = req.body;

    if (!id || !categoryName || !categoryType) {
      return res.status(400).send("Invalid data");
    }

    if (categoryType === "Brand") {
      // Handle Brand categories
      const existingBrand = await Brand.findById(id);
      if (!existingBrand) {
        return res.status(404).send("Category not found");
      }

      // Check for duplicate entries
      const duplicateBrand = await Brand.findOne({
        categoryName: categoryName,
        _id: { $ne: id },
      });
      if (duplicateBrand) {
        return res.status(409).json({ message: "Category already exists" });
      }

      // Update the category
      existingBrand.categoryName = categoryName;
      await existingBrand.save();
      // return res.status(200).json({ message: "Category updated successfully" });
      return res
        .status(200)
        .json({ success: true, updatedCategory: existingBrand });
    } else if (categoryType === "Type") {
      // Handle Type categories
      const existingType = await Type.findById(id);
      if (!existingType) {
        return res.status(404).send("Category not found");
      }

      // Check for duplicate entries
      const duplicateType = await Type.findOne({
        categoryName: categoryName,
        _id: { $ne: id },
      });
      if (duplicateType) {
        return res.status(409).json({ message: "Category already exists" });
      }

      // Update the category
      existingType.categoryName = categoryName;
      await existingType.save();
      return res
        .status(200)
        .json({ success: true, updatedCategory: existingBrand });

      // return res.status(200).json("Category updated successfully");
    } else if (categoryType === "Gear") {
      // Handle Gear categories
      const existingGear = await Gear.findById(id);
      if (!existingGear) {
        return res.status(404).send("Category not found");
      }

      // Check for duplicate entries
      const duplicateGear = await Gear.findOne({
        categoryName: categoryName,
        _id: { $ne: id },
      });
      if (duplicateGear) {
        return res.status(409).json({ message: "Category already exists" });
      }

      // Update the category
      existingGear.categoryName = categoryName;
      await existingGear.save();
      return res.status(200).json("Category updated successfully");
    } else {
      return res.status(400).send("Invalid category type");
    }
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).send("Server error");
  }
};

module.exports = {
  categories,
  addCategory,
  changeCategoryStatus,
  editCategory,
  // getEditCategories,
  // postEditCategories,
  // getAddCategory,
  // postAddCategory
};
