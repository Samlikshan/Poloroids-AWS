require('dotenv').config()
// const Category = require('../models/categoryModel')
const Brand = require('../models/brandModel')
const Gear = require('../models/gearModel')
const Type = require('../models/typeModel')

const categories = async (req,res,next) =>{
    // let categories = await Category.find({})
    let brand = await Brand.find()
    let gear  = await Gear.find()
    let type = await Type.find()
    res.render('admin/categories',{brand,gear,type})
}

const changeCategoryStatus = async (req,res)=>{
    console.log(req.body);
    if(req.body.categoryType == 'Brand'){
        let category = await Brand.findById({_id:req.body.id})
        if(category.isActive){

            await Brand.updateOne({_id:req.body.id},{$set:{isActive:false}})
        }else{
            await Brand.updateOne({_id:req.body.id},{$set:{isActive:true}})

        }
        
    }
    if(req.body.categoryType == 'Type'){
        let category = await Type.findById({_id:req.body.id})
        if(category.isActive){

            await Type.updateOne({_id:req.body.id},{$set:{isActive:false}})
        }else{
            await Type.updateOne({_id:req.body.id},{$set:{isActive:true}})

        }
        
    }
    if(req.body.categoryType == 'Gear'){
        let category = await Gear.findById({_id:req.body.id})
        if(category.isActive){

            await Gear.updateOne({_id:req.body.id},{$set:{isActive:false}})
        }else{
            await Gear.updateOne({_id:req.body.id},{$set:{isActive:true}})

        }
        
    }
    
}

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

        if (!categoryType || !categories) {
            return res.status(400).send('Invalid data');
        }

        if (categoryType === 'Brand') {

            // Validate categories data
            if (!Array.isArray(categories)) {
                return res.status(400).send('Categories must be an array');
            }

            // Check for duplicate entries
            const existingBrands = await Brand.find({ categoryName: { $in: categories.map(cat => cat.categoryName) } });
            if (existingBrands.length > 0) {
                return res.status(409).json({ message: 'Some categories already exist' });
            }

            // Insert categories
            await Brand.insertMany(categories);
            res.status(201).json('Categories added successfully');

        } else if (categoryType === 'Type') {
            console.log(req.body, 'Type');
            // Handle Type categories
            if (!Array.isArray(categories)) {
                return res.status(400).send('Categories must be an array');
            }

            // Check for duplicate entries
            const existingBrands = await Type.find({ categoryName: { $in: categories.map(cat => cat.categoryName) } });
            if (existingBrands.length > 0) {
                return res.status(409).json({ message: 'Some categories already exist' });
            }

            // Insert categories
            await Type.insertMany(categories);
            res.status(201).json('Categories added successfully');

        } else {
            console.log(req.body, 'Gear');
            // Handle Gear categories
            if (!Array.isArray(categories)) {
                return res.status(400).json('Categories must be an array');
            }

            // Check for duplicate entries
            const existingBrands = await Gear.find({ categoryName: { $in: categories.map(cat => cat.categoryName) } });
            if (existingBrands.length > 0) {
                return res.status(409).json({ message: 'Some categories already exist' });
            }

            // Insert categories
            await Gear.insertMany(categories);
            res.status(201).json('Categories added successfully');
        }

    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).send('Server error');
    }
}



module.exports = {
    categories,
    addCategory,
    changeCategoryStatus
    // getEditCategories,
    // postEditCategories,
    // getAddCategory,
    // postAddCategory
}