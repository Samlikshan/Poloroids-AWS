const Product = require('../models/productModel');

const singleProduct = async (req,res,next) =>{
    let productId = req.params.id   
    let product = await Product.findById(productId)
    let products = await Product.find({availability:true}).limit(3)
    res.render('user/product',{product,products})
}

const productResponse = async (req,res,next) =>{
    console.log('req',1)
    let productId = req.params.id   
    let product = await Product.findById(productId)
    res.status(200).json({product})
}


module.exports = {
    singleProduct,
    productResponse
}