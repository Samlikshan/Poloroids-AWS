const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const productSchema = new Schema({
    productName:{type:String},
    productDescription:{type:String,},
    price:{type:Number,},
    // productImages:{type:Array},
    mainImage:{type:String},
    additionalImages:{type:Array},
    brand:{type:String,},
    type:{type:String},
    gear:{type:String},
    sensorSize:{type:String},
    stock:{type:Number},
    reviewId:{type:ObjectId},
    availability:{type:Boolean,default:false},
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date, default:null}
})

const Product = mongoose.model('product',productSchema)

module.exports = Product