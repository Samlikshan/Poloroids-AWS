const Product = require('../models/productModel');

const singleProduct = async (req,res,next) =>{
    let productId = req.params.id   
    let product = await Product.findById(productId)
    
    res.render('user/product',{product})
}

module.exports = singleProduct