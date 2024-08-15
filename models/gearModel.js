const mongoose = require('mongoose')
const Schema = mongoose.Schema


const gearSchema = new Schema({
    categoryName:{type:String,unique:true},
    isActive:{type:Boolean,default:true},
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date, default:null}
})

const Gear = mongoose.model('Gears',gearSchema)

module.exports = Gear