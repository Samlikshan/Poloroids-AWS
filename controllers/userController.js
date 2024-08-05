require('dotenv').config()
const User = require('../models/userModel')

const listUsers = async (req,res)=>{
    let users = await User.find()
    console.log(users)
}

const blockUser = async (req,res) => {
    let id = req.params.id
    await User.updateOne({_id:id},{$set:{isActive:false}})
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