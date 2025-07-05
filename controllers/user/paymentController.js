// const { default: orders } = require("razorpay/dist/types/orders");
const { razorpay, readData, writeData } = require("../../services/payment");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");

const PaymentSession = require("../../models/paymentSession");
const Cart = require("../../models/shoppingCartModel");

const createOrder = async (req, res) => {
  try {
    const { totalAmount, finalPrice, currency, receipt, notes } = req.body;
    const options = {
      amount: finalPrice * 100, // Convert amount to paise
      currency,
      receipt,
      notes,
    };

    if (!req.user) {
      return res
        .status(401)
        .json({ message: "User not found please login again." });
    }
    const cart = await Cart.findOne({ userId: req.user?.userId });

    if (cart?.items && cart.items.length <= 0) {
      return res.status(400).json({
        message: "Cart Is empty",
      });
    }

    const isPaymentSessionActive = await PaymentSession.findOne({
      user: req.user?.userId,
      status: "pending",
    });

    if (isPaymentSessionActive) {
      return res.status(400).json({
        message:
          "Payment session active. Please try to finish pending payment session",
      });
    }

    const order = await razorpay.orders.create(options);
    const orders = readData();
    orders.push({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: "created",
    });

    writeData(orders);
    res.json(order);

    await PaymentSession.create({
      rzr_order_id: order.id,
      user: req.user?.userId,
    });
  } catch (error) {
    if (error.statusCode == 400) {
      return res
        .status(400)
        .json({ message: "Amount exceeds maximum amount allowed." });
    }
    console.log(error, "createOrder error");
  }
};

const paymentSuccess = (req, res) => {
  res.render("user/successPage");
};

const verifyPayment = async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "User not found please login again." });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const secret = razorpay.key_secret;
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  try {
    const isValidSignature = validateWebhookSignature(
      body,
      razorpay_signature,
      secret
    );
    if (isValidSignature) {
      // Update the order with payment details
      const orders = readData();
      const order = orders.find((o) => o.order_id === razorpay_order_id);
      if (order) {
        order.status = "paid";
        order.payment_id = razorpay_payment_id;
        writeData(orders);
      }

      await PaymentSession.updateOne(
        {
          user: req.user.userId,
          rzr_order_id: razorpay_order_id,
          status: "pending",
        },
        { $set: { status: "completed" } }
      );

      res.status(200).json({ status: "ok" });
      console.log("Payment verification successful");
    } else {
      res.status(400).json({ status: "verification_failed" });
      console.log("Payment verification failed");
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", message: "Error verifying payment" });
  }
};

module.exports = {
  createOrder,
  paymentSuccess,
  verifyPayment,
};
