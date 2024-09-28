const User = require('../../models/userModel')
const jwt = require("jsonwebtoken");

const getUserDetails = async(req,res) => {
    try{

        const token = req.cookies["Token"];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findOne({ username: decoded.username ,isActive:true})
        if(!user){
            res.clearCookie('Token');
            return res.redirect('/auth/login')
        }
        res.render('user/userDetails',{user})
    }catch(error){
        console.log(error,'error')
    }
}

const editUserDetails = async (req,res) =>{
    const {username,email,phoneNumber} = req.body
    try{
        const token = req.cookies["Token"];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        await User.updateOne({ username: decoded.username },{$set:{username:username,email:email,phoneNumber:phoneNumber}})
        res.status(200).json({success:true,message:'profile updated successfully'})
    }catch(error){
        console.log(error,'error')
    }
}


module.exports = {
    getUserDetails,
    editUserDetails
}

