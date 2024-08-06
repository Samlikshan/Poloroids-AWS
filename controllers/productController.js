const { request } = require('express')
const Product = require('../models/productModel')


const showProducts= async (req,res,next) => {
    let products = await Product.find()
    res.send(products)
}

const getEditProducts = async (req,res,next) => {
    let id = req.params.id
    let product = await Product.findById({_id:id})
    res.send(product)
}

const postEditProducts = async (req, res, next) => {
    let id = req.parmas.id
    let {productName,productDescription,price,brand,type,gear,sensorSize,stock} = req.body
    let productImages = req.files.map((files)=>files.path)
    await Product.updateOne({_id:id},{$set:{productName:productName,productDescription:productDescription,price:price,productImages:productImages,brand:brand,type:type,gear:gear,sensorSize,stock,updatedAt:Date()}})
    res.redirect('/admin/products')
}

const getAddProduct = async(req,res,next) => {
    res.send('show the form to add product')
}

const postAddProduct = async (req,res,next) => {
    try{
        let {productName,productDescription,price,brand,type,gear,sensorSize,stock} = req.body
        let productImages = req.files.map((files)=>files.path)
        await Product.create({productName:productName,productDescription:productDescription,price:price,productImages:productImages,brand:brand,type:type,gear:gear,sensorSize,stock})
        res.send('product added')
    }catch(err){
        if(err.code == 11000){
            console.log("product already exist")
        }
    }
}

const disableProduct = async (req,res,next) => {
    let id = req.params.id
    let product = await Product.findById({_id:id})
    if(product.availability == true){
        await Product.updateOne({_id:id},{$set:{availability:false}})
    }else{
        await Product.updateOne({_id:id},{$set:{availability:true}})
    }
    res.send('availabilty changed')
}



module.exports = {
    showProducts,
    getEditProducts,
    postEditProducts,
    getAddProduct,
    postAddProduct,
    disableProduct
}