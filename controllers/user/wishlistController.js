const Wishlist = require("../../models/wishlistModel");
const User = require("../../models/userModel");
const jwt = require("jsonwebtoken");

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const token = req.cookies["Token"];
    if (!token) {
      return res.status(401).json({ message: "user not logged yet" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({ username: decoded.username });
    const wishlist = await Wishlist.findOne({ userId: user._id });
    if (wishlist) {
      await Wishlist.findByIdAndUpdate(wishlist._id, {
        $set: { updatedAt: Date.now() },
        $push: { items: { productId: productId } },
      });
      return res.status(200).json({ message: "added to wishlist" });
    } else {
      // await Wishlist.create({items:})
      await Wishlist.create({
        userId: user._id,
        items: [
          {
            productId: productId,
          },
        ],
        updatedAt: Date.now(),
      });
      return res.status(200).json({ message: "added to wishlist" });
    }
  } catch (error) {
    console.log(error, "error adding wishlist");
  }
};

const getWishlist = async (req, res) => {
  try {
    const token = req.cookies["Token"];
    //using require now instead of this
    // if(!token){
    //   return res.status(401).json({message:'user not logged yet'})
    // }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({ username: decoded.username });
    const wishlist = await Wishlist.findOne({ userId: user._id }).populate(
      "items.productId"
    );

    if(!wishlist || wishlist.items.length === 0){
      return res.render('user/wishlist',{isEmpty:true})
    }
    console.log(wishlist.items[0].productId.stock)
    res.render("user/wishlist", { wishlist });
  } catch (error) {
    console.log(error);
  }
};

const removeItem = async (req, res) => {
  try {
    const { wishlistId, productId } = req.body;
    await Wishlist.findByIdAndUpdate(wishlistId, {
      $pull: { items: { productId: productId } },
    });
    return res.status(200).json({message:'item removed'})
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeItem,
};
