require('dotenv').config()
const Category = require('../models/categoryModel')


const categories = async (req,res,next) =>{
    let categories = await Category.find({})
    res.render('adminCategory',{categories})
}

const getEditCategories = async (req,res,next) => {
    let id = req.params.id
    let category = await Category.findById({_id:id})
    console.log(category);
    
    res.render('editCategory',category)
}

const postEditCategories = async (req,res,next) => {
    let {categoryName,subCategories} = req.body
    if(subCategories == undefined){
        subCategories = []
    }
    let id = req.params.id
    await Category.updateOne({_id:id},{$set:{categoryName:categoryName,subCategories:subCategories,updatedAt:Date()}})
    res.redirect('/admin/categories')
}

const getAddCategory = async (req,res,next) =>{
    res.render('addCategory')
} 

const postAddCategory = async (req,res,next) => {
    let category = req.body
    
    await Category.create({categoryName:category.categoryName,subCategories:category.subCategories})
    res.redirect('/admin/categories')
}

module.exports = {
    categories,
    getEditCategories,
    postEditCategories,
    getAddCategory,
    postAddCategory
}