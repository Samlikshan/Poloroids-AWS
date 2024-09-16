const mongoose = require('mongoose')
const Schema = mongoose.Schema


const wishlistScema = new Schema({
    userId:{type: mongoose.Schema.Types.ObjectId,ref:'users'},
    items:[
       {
        productId:{type: mongoose.Schema.Types.ObjectId,ref:'product'},
        addedAt: { type: Date, default: Date.now },
       }
    ],
    createdAt:{type:Date, default:Date.now},
    updatedAt:{type:Date, default:null}
})

const Wishlist = mongoose.model('wishlist',wishlistScema)

module.exports = Wishlist