const Orders = require("../../models/orderModel");
const Product = require("../../models/productModel");
const User = require("../../models/userModel");
const jwt = require("jsonwebtoken");

const viewOrder = async (req, res) => {
  const orders = await Orders.find().sort({ createdAt: -1 });
  res.render("admin/orderManagement", { orders });
};

const updateOrders = async (req, res) => {
  const { action, orderId, userId, itemId } = req.body;

  try {
    switch (action) {
      case "pending":
        await Orders.updateOne(
          { _id: orderId, "items._id": itemId },
          {
            $set: {
              orderStatus: "pending",
              updatedAt: Date.now(),
              "items.$.status": "pending",
            },
          }
        );
        return res.status(200).json({ message: "order updated successfully" });
      case "canceled":
        await Orders.updateOne(
          { _id: orderId, items: { $elemMatch: { _id: itemId } } },
          {
            $set: {
              orderStatus: "canceled",
              updatedAt: Date.now(),
              "items.$.status": "canceled",
            },
          }
        );
        return res.status(200).json({ message: "order updated successfully" });
      case "delivered":
        await Orders.updateOne(
          { _id: orderId, items: { $elemMatch: { _id: itemId } } },
          {
            $set: {
              orderStatus: "delivered",
              updatedAt: Date.now(),
              "items.$.status": "delivered",
            },
          }
        );
        return res.status(200).json({ message: "order updated successfully" });
      default:
      // return res.status(400).json("Invalid action");
    }
  } catch (error) {
    console.error(error);
    // return res.status(500).json("Something went wrong");
  }
};

const singleOrder = async (req, res) => {
  const orderId = req.params.orderId;
  const itemId = req.params.itemId;

  const order = await Orders.findById(orderId).populate("items.productId");
  const user = await User.findOne({ _id: order.userId }, { address: 0 });

  // Find the selected item and reorder
  const selectedItem = order.items.find(
    (item) => item._id.toString() === itemId.toString()
  );

  const otherItems = order.items.filter(
    (item) => item._id.toString() !== itemId.toString()
  );

  order.items = [selectedItem, ...otherItems]; // Reorder so selected is first

  res.render("admin/singleOrder", { order, user });
};

module.exports = {
  viewOrder,
  updateOrders,
  singleOrder,
};
