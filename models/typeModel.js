const mongoose = require('mongoose')
const Schema = mongoose.Schema


const typeSchema = new Schema({
    categoryName:{type:String,unique:true},
    isActive:{type:Boolean,default:true},
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date, default:null}
})

const Type = mongoose.model('Types',typeSchema)

module.exports = Type