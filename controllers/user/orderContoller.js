const User = require("../../models/userModel");
const Product = require("../../models/productModel");
const Order = require("../../models/orderModel");
const jwt = require("jsonwebtoken");
const Orders = require("../../models/orderModel");
const Wallet = require("../../models/walletModel");
//const pdf = require('html-pdf');
const path = require("path");
const exphbs = require("express-handlebars");
const hbs = exphbs.create();
const pdf = require("html-pdf-node");

const viewOrders = async (req, res) => {
  const token = req.cookies["Token"];
  if (!token) {
    return res.redirect("/auth/login");
  }
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  const user = await User.findOne({ username: decoded.username });
  const orders = await Orders.find({ userId: user._id })
    .populate("items")
    .sort({ createdAt: -1 });

  const products = await Product.find();
  // Assuming orders and products are already defined arrays

  // Update orders array with mainImage for each item
  orders.forEach((order) => {
    order.items.forEach((item) => {
      const productIdStr = String(item.productId);
      const product = products.find(
        (product) => String(product._id) === productIdStr
      );
      item.mainImage = product ? product.mainImage : null; // or some default value
    });
  });

  res.render("user/orderPage", { orders });
};

const singleOrder = async (req, res) => {
  const orderId = req.params.orderId;
  const order = await Orders.findById(orderId).populate("items");
  const user = await User.findOne({ _id: order.userId }, { address: 0 });
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
  res.render("user/orderDetails", { order, user });
};

const requestReturn = async (req, res) => {
  console.log("req");
  try {
    const { orderId, itemId, reason } = req.body;

    const existOrder = await Order.findOne({
      _id: orderId,
      "items._id": itemId,
    });

    if (!existOrder) {
      res.status(400).json({ message: "Order not found!" });
      return;
    }

    await Order.updateOne(
      { _id: orderId, "items._id": itemId },
      {
        $set: {
          "items.$.returnStatus": "requested",
          "items.$.returnReason": reason,
        },
      }
    );
    res
      .status(200)
      .json({ success: true, message: "Return requested seccessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const returnOrder = async (req, res) => {
  try {
    const { orderId, itemId, action } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const item = order.items.find((i) => i._id.toString() === itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in order" });
    }

    if (action === "rejected") {
      // ❌ Just update return status and return reason (if needed)
      await Order.updateOne(
        { _id: orderId, "items._id": itemId },
        {
          $set: {
            "items.$.returnStatus": "rejected",
          },
        }
      );
      return res
        .status(200)
        .json({ success: true, message: "Return request rejected" });
    }

    if (action === "approved") {
      // 💰 Refund
      if (
        order.paymentMethod === "razorpay" ||
        order.paymentMethod === "wallet"
      ) {
        const wallet = await Wallet.findOne({ userId: order.userId });

        const transaction = {
          productId: item.productId,
          amount: item.totalPrice,
          transactionType: "credit",
          orderId: order._id,
        };

        if (wallet) {
          await Wallet.findByIdAndUpdate(wallet._id, {
            $push: { transactions: transaction },
            $inc: { balance: item.totalPrice },
          });
        } else {
          await Wallet.create({
            userId: order.userId,
            balance: item.totalPrice,
            transactions: [transaction],
          });
        }
      }

      // ✅ Update item as returned
      await Order.updateOne(
        { _id: orderId, "items._id": itemId },
        {
          $set: {
            "items.$.status": "returned",
            "items.$.paymentStatus": "refunded",
            "items.$.returnStatus": "approved",
          },
        }
      );

      // ♻️ Restore stock
      await Product.updateOne(
        { _id: item.productId },
        { $inc: { stock: item.quantity } }
      );

      // 🔁 Recalculate final price
      const updatedOrder = await Order.findById(orderId);
      const activeItems = updatedOrder.items.filter(
        (i) => i.status !== "canceled" && i.status !== "returned"
      );

      let newFinalPrice = activeItems.reduce((sum, i) => sum + i.totalPrice, 0);

      if (order.couponDiscountPercentage) {
        const discount = (newFinalPrice * order.couponDiscountPercentage) / 100;
        newFinalPrice -= discount;
      }

      const isFullyReturned = updatedOrder.items.every(
        (i) => i.status === "returned" || i.status === "canceled"
      );

      await Order.updateOne(
        { _id: orderId },
        {
          $set: {
            finalPrice: newFinalPrice.toFixed(2),
            paymentStatus:
              isFullyReturned && order.paymentMethod !== "cod"
                ? "refunded"
                : order.paymentStatus,
            orderStatus: isFullyReturned
              ? "returned"
              : updatedOrder.orderStatus,
          },
        }
      );

      return res
        .status(200)
        .json({ success: true, message: "Return approved successfully" });
    }

    return res
      .status(400)
      .json({ success: false, message: "Invalid action provided" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { productId } = req.body;

    const order = await Order.findById(orderId);

    const { items } = await Order.findOne(
      {
        _id: orderId,
        items: { $elemMatch: { productId: productId } },
      },
      { "items.$": 1, _id: 0 }
    );

    const item = items[0];

    // 💰 Refund to wallet if needed
    if (
      order.paymentMethod === "razorpay" ||
      order.paymentMethod === "wallet"
    ) {
      const wallet = await Wallet.findOne({ userId: order.userId });
      const transaction = {
        productId: item.productId,
        amount: item.totalPrice,
        transactionType: "credit",
      };

      if (wallet) {
        await Wallet.findByIdAndUpdate(wallet._id, {
          $push: { transactions: transaction },
          $inc: { balance: item.totalPrice },
        });
      } else {
        await Wallet.create({
          userId: order.userId,
          balance: item.totalPrice,
          transactions: [transaction],
        });
      }
    }

    // 🔁 Cancel the product in the order
    await Orders.updateOne(
      { _id: orderId, items: { $elemMatch: { productId: productId } } },
      {
        $set: {
          "items.$.status": "canceled",
          "items.$.paymendStatus": "refunded",
        },
      }
    );

    // 📦 Restore stock
    await Product.updateOne(
      { _id: item.productId },
      { $inc: { stock: item.quantity } }
    );

    // 🧮 Recalculate final price for remaining items
    const updatedOrder = await Orders.findById(orderId);
    const activeItems = updatedOrder.items.filter(
      (i) => i.status !== "canceled"
    );
    const isFullyCanceled = activeItems.length === 0;

    let newFinalPrice = activeItems.reduce((sum, i) => sum + i.totalPrice, 0);

    if (order.couponDiscountPercentage) {
      const discount = (newFinalPrice * order.couponDiscountPercentage) / 100;
      newFinalPrice = newFinalPrice - discount;
    }

    // 📝 Update order payment status and final price
    await Orders.updateOne(
      { _id: orderId },
      {
        $set: {
          paymentStatus: isFullyCanceled
            ? order.paymentMethod === "cod"
              ? "canceled"
              : "refunded"
            : order.paymentMethod === "cod"
            ? "pending"
            : "paid",
          orderStatus: isFullyCanceled ? "canceled" : "pending",
          finalPrice: newFinalPrice.toFixed(2),
        },
      }
    );

    return res
      .status(200)
      .json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    console.log(error, "catch error");
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const getInvoice = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Orders.findById(orderId).populate("items.productId");

    if (!order) {
      return res.status(404).send("Order not found");
    }
    res.render("user/invoice", { order }, async (err, html) => {
      if (err) {
        return res.status(500).send("Error generating HTML for PDF");
      }

      // Generate PDF from the rendered HTML using html-pdf-node
      const file = { content: html };
      const options = { format: "A4" };

      try {
        const pdfBuffer = await pdf.generatePdf(file, options);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="Invoice.pdf"'
        );
        res.send(pdfBuffer);
      } catch (pdfError) {
        console.error("Error generating PDF:", pdfError);
        res.status(500).send("Error generating PDF");
      }
    });
    //    res.render('user/invoice', { order }, (err, html) => {
    //      if (err) {
    //        console.error(err);
    //        return res.status(500).send('Error generating HTML for PDF');
    //      }

    //      pdf.create(html).toStream((err, stream) => {
    //        if (err) {
    //          console.error(err);
    //          return res.status(500).send('Error generating PDF');
    //        }
    //        res.setHeader('Content-Type', 'application/pdf');
    //        res.setHeader('Content-Disposition', 'attachment; filename="invoice.pdf"');
    //        stream.pipe(res); // Stream the PDF as a download
    //      });
    //    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error creating invoice");
  }
};

module.exports = {
  viewOrders,
  singleOrder,
  requestReturn,
  returnOrder,
  cancelOrder,
  getInvoice,
};
