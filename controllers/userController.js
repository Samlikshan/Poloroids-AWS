require('dotenv').config()
const User = require('../models/userModel')

const listUsers = async (req,res)=>{
    let users = await User.find()
    res.render('admin/users',{users})
}

const blockUser = async (req, res) => {
    let id = req.params.id
    let user = await User.findById({ _id: id })
    if (user.isActive) {
        await User.updateOne({ _id: id }, { $set: { isActive: false } })
    } else (
        await User.updateOne({ _id: id }, { $set: { isActive: true } })
    )
    res.redirect('/admin/users')
}

const userDetails = async (req,res) => {
    let id = req.params.id
    let user = await User.findOne({_id:id})
    // let address = await Address.findOne({_id:id})
}

module.exports = {  
    listUsers,
    blockUser,
    userDetails
}