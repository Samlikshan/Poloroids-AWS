const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String },
    isActive:{type:Boolean, default:true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: null }
});
const User = mongoose.model('users', userSchema)
module.exports = User
