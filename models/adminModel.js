const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String },
    isAdmin:{type:Boolean, default:true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: null }
});
const Admin = mongoose.model('admin', adminSchema)
module.exports = Admin
