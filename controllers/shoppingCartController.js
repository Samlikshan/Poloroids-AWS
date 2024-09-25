const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const Product = require("../models/productModel");
const ShoppingCart = require("../models/shoppingCartModel");
const Offer = require("../models/offerModel");

const addToCart = async (req, res) => {
  const { productId } = req.body;
  const token = req.cookies["Token"];
  // console.log('token',token)
  if (!token) {
    return res.status(401).json({ message: "user not logged in" });
  }
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  const user = await User.findOne({
    username: decoded.username,
    isActive: true,
  });

  const product = await Product.findById({ _id: productId, isActive: true });

  if (!user) {
    return res.status(404).json("user not found");
  }

  if (!product) {
    return res.status(404).json("product not found");
  }

  try {
    const cart = await ShoppingCart.findOne({ userId: user._id });

    if (!cart) {
      await ShoppingCart.create({
        userId: user._id,
        items: [
          {
            productId: productId,
            addedAt: Date.now(),
          },
        ],
        createdAt: Date.now(),
      });
      res.status(200).json("Item added to cart");
    } else if (cart) {
      const existingItem = cart.items.find(
        (item) => item.productId == productId
      );

      if (existingItem) {
        await ShoppingCart.updateOne(
          { _id: cart._id, "items.productId": productId },
          {
            $inc: { "items.$.quantity": 1 },
            $set: { updatedAt: Date.now(), "items.$.updatedAt": Date.now() },
          }
        );
        res.status(200).json("quntity updated succussfully");
      } else {
        const newItem = {
          productId: productId,
          quantity: 1,
        };
        await ShoppingCart.updateOne(
          { _id: cart._id },
          { $push: { items: newItem } }
        );
        res.status(200).json("new item added succussfully");
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json("Something happened");
  }
};

const viewCart = async (req, res) => {
  const token = req.cookies["Token"];
  if (!token) {
    return res.status(401);
  }

  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  const user = await User.findOne({
    username: decoded.username,
    isActive: true,
  });

  try {
    const cart = await ShoppingCart.findOne({ userId: user._id });

    // Check if cart exists and has items
    if (!cart || cart.items.length === 0) {
      return res.render('user/shoppingCart', { isEmpty: true });
    }

    // Fetch product details and apply any applicable offers
    const productPromises = cart.items.map(async (item) => {
      const product = await Product.findById(item.productId);

      // Fetch product-specific offer
      const productOffer = await Offer.findOne({
        typeId: product._id,
        offerType: 'product',
        validFrom: { $lte: new Date() },
        validTo: { $gte: new Date() },
        status: true
      });

      // Fetch brand-specific offer and populate the `typeId` field to access `categoryName`
      const brandOffer = await Offer.findOne({
        offerType: 'brand',
        validFrom: { $lte: new Date() },
        validTo: { $gte: new Date() },
        status: true
      }).populate('typeId');  // Populating typeId for brand

      // Check if the populated brandOffer's `categoryName` matches the product's `brand`
      let finalBrandOffer = null;
      if (brandOffer && brandOffer.typeId && brandOffer.typeId.categoryName === product.brand) {
        finalBrandOffer = brandOffer;
      }

      // Calculate the final price based on the highest discount offer
      let price = product.price;
      if (productOffer && finalBrandOffer) {
        // Choose the offer with the higher discount percentage
        const maxDiscount = Math.max(productOffer.discountPercentage, finalBrandOffer.discountPercentage);
        price = product.price - (product.price * maxDiscount / 100);
      } else if (productOffer) {
        price = product.price - (product.price * productOffer.discountPercentage / 100);
      } else if (finalBrandOffer) {
        price = product.price - (product.price * finalBrandOffer.discountPercentage / 100);
      }

      return {
        ...product.toObject(),
        price,                // The final price after applying the offer (if any)
        quantity: item.quantity,  // Product quantity in the cart
      };
    });

    const products = await Promise.all(productPromises);

    // Render the cart page with products and their final prices
    res.render("user/shoppingCart", { products });
  } catch (err) {
    console.error(err);
    res.status(500).json("Something went wrong");
  }
};



const updateitem = async (req, res) => {
  const { productId, action } = req.body;
  const token = req.cookies["Token"];
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  const user = await User.findOne({
    username: decoded.username,
    isActive: true,
  });
  const cart = await ShoppingCart.findOne({ userId: user._id });

  if (!cart) {
    return res.status(404).json("Cart not found");
  }

  try {
    switch (action) {
      case "inc":
        await ShoppingCart.updateOne(
          { _id: cart._id, "items.productId": productId },
          {
            $inc: { "items.$.quantity": 1 },
            $set: { updatedAt: Date.now(), "items.$.updatedAt": Date.now() },
          }
        );
        const updatedItemInc = await ShoppingCart.findOne(
          { _id: cart._id, "items.productId": productId },
          { "items.$": 1 }
        );
        return res.json({ newQuantity: updatedItemInc.items[0].quantity });
      case "dec":
        await ShoppingCart.updateOne(
          { _id: cart._id, "items.productId": productId },
          {
            $inc: { "items.$.quantity": -1 },
            $set: { updatedAt: Date.now(), "items.$.updatedAt": Date.now() },
          }
        );
        const updatedItemDec = await ShoppingCart.findOne(
          { _id: cart._id, "items.productId": productId },
          { "items.$": 1 }
        );
        return res.json({ newQuantity: updatedItemDec.items[0].quantity });
      case "remove":
        await ShoppingCart.updateOne(
          { _id: cart._id },
          { $pull: { items: { productId: productId } } }
        );
        return res.status(200).json("Item removed successfully");
      default:
        return res.status(400).json("Invalid action");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json("Something went wrong");
  }
};

const checkout = async (req, res) => {
  const token = req.cookies["Token"];
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  const user = await User.findOne({
    username: decoded.username,
    isActive: true,
  });
  const cart = await ShoppingCart.findOne(
    { userId: user._id },
    { items: 1, _id: 0 }
  );
  const Items = cart.items;
  res.status(200).json({ Items });
};

module.exports = { addToCart, viewCart, updateitem, checkout };
