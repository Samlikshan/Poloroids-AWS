let express = require('express');
let router = express.Router();
const { getSignup, postSingup, getVerify, postVerify, resendOtp, getLogin, postLogin, getForgotPassword, postForgotPassword, getForgotPasswordVerification, postForgotPasswordVerification, getResetPassword, postResetPassword,  } = require('../controllers/authController');
const googleAuth = require('../config/passoprt');
const passport = require('passport')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

googleAuth(passport)

router.get('/google',passport.authenticate('google', { scope: ['email', 'profile'] }))
router.get('/google/callback',passport.authenticate('google', { failureRedirect: '/' }),
async (req, res) => {
  // Successful authentication, generate JWT
  // console.log(req.user);
  
  let {displayName,email,id} = req.user
  let user = await User.findOne({ $or: [{ username: displayName }, { email: email }] })
  // console.log(user,"user");
  
  if(!user){
    console.log('no user');
    
      await User.create({googleId:id,username:displayName,email:email})
      const token = jwt.sign({id,displayName,email}, process.env.SECRET_KEY, { expiresIn: '1d' });
    //   res.json({token})
        res.cookie('Token',token)
      res.redirect('/')
      
    }else if(user){
      
      if(user.isActive == true){
        let { googleId,username,email } = user
        const token = jwt.sign({googleId,username,email}, process.env.SECRET_KEY, { expiresIn: '1d' });
        res.cookie('Token',token)
        
        res.redirect('/')
      }else{

        res.status(403).json({message:'Your account is temporarily Banned'})
      }
    }
})
router.get('/signup',getSignup);

router.post('/signup', postSingup)

router.get('/verification', getVerify)
// router.get('/resend-otp', resendOtp)
router.post('/verification', postVerify)

router.get('/login',getLogin)
router.post('/login',postLogin)

router.get('/forgot',getForgotPassword)
router.post('/forgot',postForgotPassword)
router.get('/forgotVerify',getForgotPasswordVerification)
router.post('/forgotVerify',postForgotPasswordVerification)
router.get('/resetPassword',getResetPassword)
router.post('/resetPassword',postResetPassword)

module.exports = router;
