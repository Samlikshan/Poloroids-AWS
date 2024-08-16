const Admin = require('../models/adminModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {generateOTP,sendMail} = require('../services/emailVerification')


const getLogin = (req,res)=>{
    res.render('admin/login')
}

const postLogin = async (req,res)=>{
    let {username,password} = req.body
    
    let admin = await Admin.findOne({username:username})
    
    if(admin){
        password = await bcrypt.compare(password, admin.password)
        
        if(password){
            let token = jwt.sign({username,role:'admin'},process.env.SECRET_KEY,{ expiresIn: '1d' })
            res.cookie('Token',token)
            res.status(200).json({token})
        }else{
            res.status(401).json({message:'Username or Password in incorrect'})
        }
    }else{
        res.status(401).json({message:'Admin not found'})
    }
}

const getResetPassword = async (req,res)=>{
    let token = await req.cookies['Token'] 
    let decoded = await jwt.verify(token,process.env.SECRET_KEY)
    let user = await Admin.findOne({username:decoded.username})
    
    let otp = await generateOTP()
    console.log(otp.otp);
    
    req.session.otp = otp.otp
    await sendMail(user.email,otp.otp)
    res.render('admin/resetPassword')
    
}
const postResetPassword = async (req,res)=>{
    
    if(req.session.otp == req.body.otp){
        // res.render('/admin/new-password')
        res.status(200).json({message:'otp validated succussfully'})
    }else{
        res.status(401).json({ message: 'Invalid otp' })
    }
    
}


const getNewPassword = async (req,res)=>{
    res.render('admin/newPassword')
    
    // let token = await req.cookies['Token'] 
    // let decoded = await jwt.verify(token,process.env.SECRET_KEY)
    // // let user = await Admin.findOne({username:decoded.username})
    // await Admin.updateOne({username:decoded.username},{$set:{password:req.body.password}})
    
}

const postNewPassword = async (req,res)=>{
    let token = await req.cookies['Token'] 
    if(token){
        let decoded = await jwt.verify(token,process.env.SECRET_KEY)
        let password = req.body.password
        password = await bcrypt.hash(password, 10)
        await Admin.updateOne({username:decoded.username},{$set:{password:password}})
        res.redirect('/admin')
    }else{
        let password = req.body.password
        password = await bcrypt.hash(password, 10)

        await Admin.updateOne({email:req.session.email},{$set:{password:password}})
        res.redirect('/admin')
    }
    // let user = await Admin.findOne({username:decoded.username})
}


const getForgotPasswrod = (req,res) => {
    res.render('admin/forgotPassword')
}
const postForgotPassword = async (req,res) => {
    let otp = await generateOTP()
    console.log(otp.otp);
    
    req.session.otp = otp.otp
    req.session.email = req.body.email
    await sendMail(req.body.email,otp.otp)
    res.render('admin/resetPassword')
    // let user = await Admin.findOne({email:req.body.email})
    // console.log(user);
    
}



const logout = (req,res) => {
    res. clearCookie('Token')
    res.redirect('/admin/login')
}



module.exports = {
    getLogin,
    postLogin,
    getForgotPasswrod,
    postForgotPassword,
    getResetPassword,
    postResetPassword,
    getNewPassword,
    postNewPassword,
    logout    
}