let express = require("express");
let router = express.Router();
const {
  viewCheckout,
  postCheckout,
  successPage
} = require("../controllers/user/checkoutController");
const {createOrder,paymentSuccess, verifyPayment} = require('../controllers/user/paymentController')


router.get("/checkout", viewCheckout);
router.post("/chekout", postCheckout);
router.get("/success", successPage);
router.post('/create-order',createOrder)
router.post('/verify-payment',verifyPayment)
// router.get('/success',createOrder)
module.exports = router;
