const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema ({
    categoryName:{type:String},
    subCategories:{type:Array},
    createdAt:{type:Date, default:Date.now},
    updatedAt:{type:Date, default:null}
})

const Category = mongoose.model('categories',categorySchema)

module.exports = Category