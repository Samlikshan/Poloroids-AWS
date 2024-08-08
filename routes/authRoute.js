let express = require('express');
let router = express.Router();
const { route } = require('.');
const { getSignup, postSingup, getVerify, postVerify, resendOtp, getLogin, postLogin, getForgotPassword, postForgotPassword, getForgotPasswordVerification, postForgotPasswordVerification, getResetPassword, postResetPassword,  } = require('../controllers/authController');


router.get('/signup',getSignup);

router.post('/signup', postSingup)

router.get('/verification', getVerify)
router.get('/resend-otp', resendOtp)
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
