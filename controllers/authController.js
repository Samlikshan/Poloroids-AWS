require('dotenv').config()
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const { TOTP } = require('totp-generator')
const nodemailer = require('nodemailer')
// const { render } = require('../app')

const generateOTP = async () => {
    try {
        const otp = await TOTP.generate(process.env.SECRET_KEY, {
            digits: 4,
            period: 1
        });
        return otp;
    } catch (error) {
        console.error('Error generating OTP:', error);
        throw error;
    }
}

const sendMail = async (email,otp) => {
    console.log(email,otp)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass:  process.env.PASSWORD
        }
    });

    const mailOptions = {
        from: "polaroids@gmail.com",
        to: `${email}`,
        subject: 'OTP Verification',
        // text: 'Hello world?',
        html: `${otp}` 
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
    
}

// const verifyOtp = async (req,res,next,email) => {
//     try {
//         const otp = await generateOTP()
//         req.session.otp = otp
//         await sendMail(email,otp.otp)
//         next()
//     }catch(err){
//         console.log(err)
//     }
// }

const getSignup = ( req, res ) => {
    res.render('signup')
}

const postSingup = async (req, res) => {
    
    try {
        const { username, email, password } = req.body
        let user = await User.findOne({ $or: [{ username: username }, { email: email }] })
        let isEmail = validator.isEmail(email)
        let isStrongPassword = validator.isStrongPassword(password)
        if (!user && isEmail && isStrongPassword) {
            bcrypt.hash(password, 10).then(async (hash) => {
                req.body.password = hash
                req.session.user = req.body
                console.log(req.session.user)
                // let token = jwt.sign({ username: username, email: email }, process.env.SECRET_KEY)
                res.redirect('/auth/verification')
            })
        } else if (user) {
            if (user.username == username) {
                console.log("username already teken")
            } else {
                console.log("email already taken")
            }
        } else {
            console.log('Password is too weak')
        }
        
    } catch (err) {
        if (err.code == 11000) {
            res.status(200).json({ msg: 'user already exist' })
            console.log('user already exist')
        }
    }
}

const getVerify = async (req, res, next) => {
    try {
        const otp = await generateOTP()
        req.session.otp = otp
        await sendMail(req.session.user.email,otp.otp)
        res.render('verify', { title: 'verification' })
    } catch (err) {
        console.log(err)
    }

}

const postVerify = async (req, res, next) => {
    let otp = req.body.otp.toString().split(',').join('')
    if (req.session.otp && otp == req.session.otp.otp) {
        const { username, email, password } = req.session.user
        await User.create({ username: username, email: email, password: password })
        let token = jwt.sign({username,email},process.env.SECRET_KEY)
        console.log(token)
        res.redirect('/auth/login')
    } else {
        console.log("wrong otp")
        res.send(400, { msg: 'wrong otp' })
    }

}

const resendOtp = async (req, res, next) => {
    try {
        res.redirect('/auth/verification')
    } catch (err) {
        console.log(Error)
    }
}

const getLogin = async (req, res, next) => {
    res.render('login',{title:"Login"})
}

const postLogin = async (req, res, next) => {
    let { username, password } = req.body
    try {
        let user = await User.findOne({username:username})
        console.log(user.isActive)
        if(user && user.isActive){
            password = await bcrypt.compare(password,user.password)
            if(password){
                res.redirect('/')
            }else{
                console.log('username or password is incorrect')
            }
        }else{
            console.log('user not found')
        }
    } catch (err) {
        console.log(err)
    }
}


const getForgotPassword = (req,res,next) =>{
    res.render('forgotPassword')
}

const postForgotPassword = async (req,res,next) =>{
    let email = req.body.email
    try{
        let user = await User.findOne({email:email})
        req.session.user = user
        if(user){
            let otp = await generateOTP()
            req.session.otp = otp
            await sendMail(email,otp.otp)
            res.redirect('/auth/forgotVerify')
        }
    }catch(err){
        console.log(err)
    }
}

const getForgotPasswordVerification = async (req,res,next) =>{
    res.render('forgotPasswordVerify')
}

const postForgotPasswordVerification = (req,res,next) => {
    let otp = req.body.otp.toString().split(',').join('')
    if (req.session.otp && otp == req.session.otp.otp){
        res.redirect('/auth/resetPassword')
    }
}

const getResetPassword = (req,res)=>{
    res.render('resetPassword')
}


const postResetPassword = async (req,res,next)=>{
    let {password,confirmPassword} = req.body
    if(password == confirmPassword){
        password = await bcrypt.hash(password ,10)
        await User.updateOne({username:req.session.user.username},{$set:{password:password}})
        console.log('password changed')
        res.redirect('/auth/login')
    }
}


module.exports = {
    getSignup,
    postSingup,
    getVerify,
    postVerify,
    resendOtp,
    getLogin,
    postLogin,
    getForgotPassword,
    postForgotPassword,
    getForgotPasswordVerification,
    postForgotPasswordVerification,
    getResetPassword,
    postResetPassword
}