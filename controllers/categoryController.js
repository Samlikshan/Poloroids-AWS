require('dotenv').config()
const Category = require('../models/categoryModel')


const categories = async (req,res,next) =>{
    let categories = await Category.find({})
    res.send(categories)
}

const getEditCategories = async (req,res,next) => {
    let id = req.params.id
    let category = await Category.findById({_id:id})
    console.log(category)
    res.send(category)
}

const postEditCategories = async (req,res,next) => {
    let id = req.params.id
    console.log(req.body,id)
    await Category.updateOne({_id:id},{$set:{subCategories:req.body.subCategories,updatedAt:Date()}})
    res.send("category changed")
}

const getAddCategory = async (req,res,next) =>{
    res.send("fields for adding category")
} 

const postAddCategory = async (req,res,next) => {
    let category = req.body
    console.log(category.subCategories)
    await Category.create({categoryName:category.name,subCategories:category.subCategories})
    res.send("Category added")
}

module.exports = {
    categories,
    getEditCategories,
    postEditCategories,
    getAddCategory,
    postAddCategory
}