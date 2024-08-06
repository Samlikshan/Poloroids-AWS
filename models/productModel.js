const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const productSchema = new Schema({
    productName:{type:String, unique:true},
    productDescription:{type:String, required:true},
    price:{type:Number,required:true},
    productImages:{type:Array,required:true},
    brand:{type:String},
    type:{type:String},
    gear:{type:String},
    sensorSize:{type:String},
    stock:{type:Number,required:true},
    reviewId:{type:ObjectId},
    availability:{type:Boolean,default:true},
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date, default:null}
})

const Product = mongoose.model('Products',productSchema)

module.exports = Product