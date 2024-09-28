// const { default: orders } = require("razorpay/dist/types/orders");
const {razorpay,readData,writeData} = require("../../services/payment");
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');

const createOrder = async (req, res) => {
  try {
    const { totalAmount, finalPrice, currency, receipt, notes } = req.body;
    const options = {
      amount: finalPrice * 100, // Convert amount to paise
      currency,
      receipt,
      notes,
    };

    const order = await razorpay.orders.create(options);
    const orders = readData();
    orders.push({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: 'created',
    });
    writeData(orders);
    res.json(order);

  } catch (error) {
    if(error.statusCode == 400){
      return res.status(400).json({message:'Amount exceeds maximum amount allowed.'})
    }
    console.log(error, "createOrder error");
  }
};

const paymentSuccess = (req, res) => {
  res.render("user/successPage");
};

const verifyPayment = (req,res)=> {
    console.log('req')
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const secret = razorpay.key_secret;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
  
    try {
      const isValidSignature = validateWebhookSignature(body, razorpay_signature, secret);
      if (isValidSignature) {
        // Update the order with payment details
        const orders = readData();
        const order = orders.find(o => o.order_id === razorpay_order_id);
        if (order) {
          order.status = 'paid';
          order.payment_id = razorpay_payment_id;
          writeData(orders);
        }
        console.log(orders,order,1)
        res.status(200).json({ status: 'ok' });
        console.log("Payment verification successful");
      } else {
        res.status(400).json({ status: 'verification_failed' });
        console.log("Payment verification failed");
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Error verifying payment' });
    }
}

module.exports = {
  createOrder,
  paymentSuccess,
  verifyPayment
};
