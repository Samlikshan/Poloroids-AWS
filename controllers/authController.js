require("dotenv").config();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { generateOTP, sendMail } = require("../services/emailVerification");
const generateReferralCode = require('../services/referralCode')
const Wallet = require('../models/walletModel')
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

const getSignup = (req, res) => {
  res.render("user/signup");
};

const postSingup = async (req, res) => {
  try {
    const { username, email, password , confirmPassword,referralCode} = req.body;
    if (!username || !username.trim()) {
      return res
        .status(400)
        .json({ message: "Fields cannot be empty or whitespace" });
    }
    if (!password || !password.trim()) {
      return res.status(400).json({ message: "Fields cannot be empty" });
    }
    let user = await User.findOne({
      $or: [{ username: username.toLowerCase() }, { email: email }],
    });
    if(referralCode){
      const referredUser = await User.findOne({referralCode:referralCode})
      if(!referredUser){
        return res.status(400).json({message:'Invalid refferal code'})
      }
    }
    let isEmail = validator.isEmail(email);
    let isStrongPassword = validator.isStrongPassword(password);
    if (!user && password == confirmPassword) {
      if (!isEmail) {
        // throw new Error("Invalid Email");
        res.status(401).json({ message: "Invalid Email" });
      } else if (!isStrongPassword) {
        // throw new Error("Password is not strong")
        res.status(401).json({ message: "Password is not Strong" });
      } else {
        bcrypt.hash(password, 10).then(async (hash) => {
          req.body.password = hash;
          req.session.user = req.body;
          // let token = jwt.sign({ username: username, email: email }, process.env.SECRET_KEY)
          // res.redirect('/auth/verification')
          res.status(200).json({ message: "An otp is sent to your Email" });
        });
      }
    } else if (user) {
      if (user.username == username.toLowerCase()) {
        // throw new Error("Username already taken");
        res.status(401).json({ message: "Username already taken" });
      } else {
        // throw new Error("Email already taken")
        res.status(401).json({ message: "Email already taken" });
      }
    } else {
      // throw new Error("Password doesn't match")
      res.status(401).json({ message: "Password doesn't match" });
    }
  } catch (error) {
    // res.render('signup',{error})
    console.log(error,'error post signup')
    res.status(509).json({ message: "Oops server error" });
  }
};

const getVerify = async (req, res, next) => {
  try {
    const otp = await generateOTP();
    req.session.otp = otp;
    await sendMail(req.session.user.email, otp.otp);
    res.render("user/verify");
  } catch (err) {
    console.log(err);
  }
};

const postVerify = async (req, res, next) => {
  try {
    let otp = req.body;
    if (req.session.otp && otp.otp == req.session.otp.otp) {
      const { username, email, password,referralCode } = req.session.user;
      if(referralCode){
        const referredUser = await User.findOne({referralCode:referralCode})
        if(!referredUser){
          return res.status(400).json({message:'Invalid refferal code'})
        }
      await Wallet.create({userId:referredUser._id,balance:1000})
      }
      const newReferralCode = generateReferralCode()
      const user = await User.create({
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        referralCode:newReferralCode,
        password: password,
      });
	await Wallet.create({userId:user.id,balance:500})      
      
      // let token = jwt.sign({username,email},process.env.SECRET_KEY)
      res.status(200).json({ message: "Succesfully Registered" });
      // res.redirect('/auth/login')
    } else {
      // throw new Error("Invalid otp");
      console.log("req");
      return res.status(401).json({ message: "Invalid otp" });
    }
  } catch (error) {
    console.log(error,'error creating user')
    res.render("user/verify", { error });
  }
};

const resendOtp = async (req, res, next) => {
  try {
    const otp = await generateOTP();
    req.session.otp = otp;
    await sendMail(req.session.user.email, otp.otp);
    res.render("user/verify");
  } catch (err) {
    console.log(err);
  }
};

//Login
const getLogin = async (req, res, next) => {
  res.render("user/login");
};

//Post Login
const postLogin = async (req, res, next) => {
  let { username, password } = req.body;
  if (!username || !username.trim()) {
    return res
      .status(400)
      .json({ message: "Fields cannot be empty or whitespace" });
  }
  if (!password || !password.trim()) {
    return res.status(400).json({ message: "Fields cannot be empty" });
  }
  try {
    let user = await User.findOne({ username: username.toLowerCase() });
    if (user) {
      passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        if (user.isActive == false) {
          res
            .status(403)
            .json({ message: "Your account is temporarily Banned " });
        } else {
	  username = user.username
          let token = jwt.sign(
            { username, role: "user" },
            process.env.SECRET_KEY,
            { expiresIn: "1d" }
          );
          res.cookie("Token", token);
          res.status(200).json({ token });
        }
        // res.redirect('/')
      } else {
        res.status(401).json({ message: "Username or password is incorrect" });
      }
    } else {
      // throw new Error("User not found");
      res.status(401).json({ message: "User not found" });
    }
  } catch (error) {
    // res.render('login', { error })
    res.status(401).json({ message: "Somethign occured on the server" });
  }
};

const getForgotPassword = (req, res, next) => {
  res.render("user/forgot");
};

const postForgotPassword = async (req, res, next) => {
  req.session.email = req.body.email;
  try {
    let user = await User.findOne({ email: req.session.email });
    req.session.user = user;
    if (user) {
      res.redirect("/auth/forgotVerify");
    } else {
      res.render('user/forgot',{error:'invalid email'})
    }
  } catch (err) {
    console.log(err);
  }
};

const getForgotPasswordVerification = async (req, res, next) => {
  let otp = await generateOTP();
  req.session.otp = otp;
  await sendMail(req.session.email, otp.otp);
  res.render("user/forgotPasswordVerify");
};

// const postForgotPasswordVerification = (req, res, next) => {
//   let otp = req.body.otp.toString().split(",").join("");
//   try{
//     if (req.session.otp && otp == req.session.otp.otp) {
//       res.redirect("/auth/resetPassword");
//     }else{
//       return res.status(400).json({ message: "Invalid otp" });
//     }
//   }catch(error){
//     console.log('Error occured on forgot password verify',error)
//   }
// };

const postForgotPasswordVerification = (req, res) => {
  const otp = req.body.otp.toString().replace(/,/g, ""); // Remove any commas if needed
  try {
    if (req.session.otp && otp === req.session.otp.otp) {
      res.redirect("/auth/resetPassword");
    } else {
      return res.status(400).json({ message: "Invalid OTP" }); // Use 400 Bad Request
    }
  } catch (error) {
    console.error("Error occurred during forgot password verification:", error);
    res.status(500).json({ message: "Internal server error" }); // Handle server errors
  }
};

const getResetPassword = (req, res) => {
  res.render("user/resetPassword");
};

const postResetPassword = async (req, res, next) => {
  let { password, confirmPassword } = req.body;
  try {
    const token = req.cookies["Token"];
    if (token) {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      password = await bcrypt.hash(password, 10);
      await User.updateOne(
        { username: decoded.username },
        { $set: { password: password } }
      );
      return res
        .status(200)
        .json({ success: true, message: "Password changed successfully" });
    }

    if (req.session.user) {
      if (password == confirmPassword) {
        password = await bcrypt.hash(password, 10);
        await User.updateOne(
          { username: req.session.user.username },
          { $set: { password: password } }
        );
        console.log("password changed");
        return res
          .status(200)
          .json({ success: true, message: "Password changed successfully" });
      }
    }
  } catch (error) {
    console.log("Error changing password", error);
  }
};

const getpreviousPassword = (req, res) => {
  res.render("user/previousPassword");
};

const postpreviousPassword = async (req, res) => {
  try {
    let { password } = req.body;
    const token = req.cookies["Token"];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({ username: decoded.username });
    password = await bcrypt.compare(password, user.password);
    if (!password) {
      return res.status(401).json({ message: "Wrong password" });
    }
    return res.status(200).json("password matched!");
  } catch (error) {
    console.log(error, "error getting previous password");
  }
};

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
  postResetPassword,
  getpreviousPassword,
  postpreviousPassword,
};
