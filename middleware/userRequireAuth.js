require("dotenv").config();
const jwt = require("jsonwebtoken");
// const User = require("../models/userModel");

const userRequireAuth = async (req, res, next) => {
  let token = await req.cookies["Token"];
  console.log(token)
  try {
    if (!token) {
      return res.redirect("/auth/login");
      // return res.status(401).json('token not found')
    } else {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      if (decoded.role == "user") {
        return next();
      } else if (decoded.role == "admin") {
        return res.redirect("/admin");
      } else {
        return res.redirect("/auth/login")
        // return res.status(401).json('Token is invalid')
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = userRequireAuth;
