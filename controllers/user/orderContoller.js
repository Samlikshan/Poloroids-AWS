const User = require("../../models/userModel");
const Product = require("../../models/productModel");
const Order = require("../../models/orderModel");
const jwt = require("jsonwebtoken");
const Orders = require("../../models/orderModel");
const Wallet = require("../../models/walletModel");
//const pdf = require('html-pdf');
const path = require('path');
const exphbs = require('express-handlebars');
const hbs = exphbs.create(); 
const pdf = require('html-pdf-node');

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

const returnOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);

    const wallet = await Wallet.findOne({ userId: order.userId });
    const transaction = {
      orderId: orderId,
      amount: order.finalPrice,
      transactionType: "credit",
    };
    if (wallet) {
      await Wallet.findByIdAndUpdate(wallet._id, {
        $push: { transactions: transaction },
        $inc: { balance: order.finalPrice },
      });
    } else {
      await Wallet.create({
        userId: order.userId,
        balance: order.finalPrice, // Initialize with the transaction amount
        transactions: [transaction], // Add the first transaction
      });
    }
    await Orders.updateOne(
      { _id: orderId },
      { $set: { paymentStatus: "refunded" } }
    )
    await Orders.updateOne(
      { _id: orderId },
      { $set: { orderStatus: "returned" } }
    );
    for (const item of order.items) {
      await Product.updateOne({ _id: item.productId }, { $inc: { stock: item.quantity } });
    }
    return res
      .status(200)
      .json({ success: true, message: "order cancelled successfully" });
  } catch (error) {
    console.log(error, "catch error");
  }
};

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);
    if (order.paymentMethod == "razorpay" || order.paymentMethod == "wallet") {
      const wallet = await Wallet.findOne({ userId: order.userId });
      const transaction = {
        orderId: orderId,
        amount: order.finalPrice,
        transactionType: "credit",
      };
      if (wallet) {
        await Wallet.findByIdAndUpdate(wallet._id, {
          $push: { transactions: transaction },
          $inc: { balance: order.finalPrice },
        });
        await Orders.updateOne(
          { _id: orderId },
          { $set: { paymentStatus: "refunded" } }
        )
      } else {
        await Wallet.create({
          userId: order.userId,
          balance: order.finalPrice, 
          transactions: [transaction],
        });
        await Orders.updateOne(
          { _id: orderId },
          { $set: { paymentStatus: "refunded" } }
        )
      }
    }

    await Orders.updateOne(
      { _id: orderId },
      { $set: { orderStatus: "canceled" } }
    );
    for (const item of order.items) {
      await Product.updateOne({ _id: item.productId }, { $inc: { stock: item.quantity } });
    }
    return res
      .status(200)
      .json({ success: true, message: "order cancelled successfully" });
  } catch (error) {
    console.log(error, "catch error");
  }
};

const getInvoice = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Orders.findById(orderId).populate('items.productId');

    if (!order) {
      return res.status(404).send('Order not found');
    }
     res.render('user/invoice', { order }, async (err, html) => {
            if (err) {
                return res.status(500).send('Error generating HTML for PDF');
            }

            // Generate PDF from the rendered HTML using html-pdf-node
            const file = { content: html };
            const options = { format: 'A4' };

            try {
                const pdfBuffer = await pdf.generatePdf(file, options);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename="Invoice.pdf"');
                res.send(pdfBuffer);
            } catch (pdfError) {
                console.error('Error generating PDF:', pdfError);
                res.status(500).send('Error generating PDF');
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
    return res.status(500).send('Error creating invoice');
  }
};


module.exports = {
  viewOrders,
  singleOrder,
  returnOrder,
  cancelOrder,
  getInvoice
};
