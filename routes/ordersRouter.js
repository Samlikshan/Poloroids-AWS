let express = require("express");
let router = express.Router();
const {
  viewCheckout,
  postCheckout,
  successPage,
  checkWallet,
  failedPayment,
  failedPage,
  retryPayment
} = require("../controllers/user/checkoutController");
const {createOrder,paymentSuccess, verifyPayment} = require('../controllers/user/paymentController')


router.get("/checkout", viewCheckout);
router.post("/chekout", postCheckout);
router.post("/order-wallet", checkWallet);
router.get("/success", successPage);
router.post('/failed-payment',failedPayment)
router.post('/retry-payment',retryPayment)
router.get('/failed',failedPage)
router.post('/create-order',createOrder)
router.post('/verify-payment',verifyPayment)
// router.get('/success',createOrder)
module.exports = router;
