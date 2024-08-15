const Product = require('../models/productModel')
// const Category = require('../models/categoryModel')\
const Brand = require('../models/brandModel')
const Type = require('../models/typeModel')
const Gear = require('../models/gearModel')


const getProducts = async(req,res)=>{
    let products = await Product.find({availability:true})
    let brands = await Brand.find({isActive:true})
    let types = await Type.find({isActive:true})
    let gears = await Gear.find({isActive:true})
    console.log(brands);
    
    // let categories = await Category.find()
    res.render('user/shop',{products,brands,types,gears})
}

module.exports = getProducts