const Wallet = require("../../models/walletModel");
const User = require("../../models/userModel");
const jwt = require("jsonwebtoken");

const viewWallet = async (req, res) => {
  const token = req.cookies["Token"];
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  const user = await User.findOne({ username: decoded.username });
  const wallet = await Wallet.findOne({userId:user._id})
  console.log(wallet)
  res.render('user/wallet',wallet)
};

module.exports = {
    viewWallet
}