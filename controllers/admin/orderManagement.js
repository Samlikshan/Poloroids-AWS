const Orders = require('../../models/orderModel')
const Product = require('../../models/productModel')
const User = require('../../models/userModel')
const jwt = require('jsonwebtoken')
const viewOrder = async (req,res) =>{
    const orders =  await Orders.find().sort({createdAt:-1})
    res.render('admin/orderManagement',{orders}) 
}

const updateOrders = async (req,res)=>{
    const {action, orderId, userId} = req.body
    try {
        switch (action) {
          case "pending":
            await Orders.updateOne(
              { _id: orderId },
              {
                $set: { orderStatus:'pending',updatedAt:Date.now()},
              }
            );
            return res.status(200).json({message:'order updated successfully'})
          case "canceled":
            await Orders.updateOne(
              { _id: orderId },
              {
                $set: { orderStatus:'canceled',updatedAt:Date.now()},
              }
            );
            return res.status(200).json({message:'order updated successfully'})
          case "delivered":
            await Orders.updateOne(
              { _id: orderId },
              {
                $set: { orderStatus:'delivered',updatedAt:Date.now()},
              }
            );
            return res.status(200).json({message:'order updated successfully'})
          default:
            // return res.status(400).json("Invalid action");
        }
      } catch (error) {
        console.error(error);
        // return res.status(500).json("Something went wrong");
      }
}

const singleOrder = async (req,res)=>{
  const orderId = req.params.orderId
  const order = await Orders.findById(orderId)
  .populate("items")
  const user = await User.findOne({_id:order.userId},{address:0});
  const products = await Product.find();
  // Assuming orders and products are already defined arrays

  // Update orders array with mainImage for each item
    order.items.forEach((item) => {
      const productIdStr = String(item.productId);
      const product = products.find(
        (product) => String(product._id) === productIdStr
      );
      item.mainImage = product ? product.mainImage : null; // or some default value
    });
    console.log(order,user)
    console.log(order)
  res.render('admin/singleOrder',{order,user})
}


module.exports = {
    viewOrder,
    updateOrders,
    singleOrder
}