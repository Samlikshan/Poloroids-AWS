let express = require("express");
let router = express.Router();
const {
  viewCheckout,
  postCheckout,
  successPage,
  checkWallet,
  failedPayment,
  failedPage,
  retryPayment,
} = require("../controllers/user/checkoutController");
const {
  createOrder,
  paymentSuccess,
  verifyPayment,
} = require("../controllers/user/paymentController");
const userRequireAuth = require("../middleware/userRequireAuth");

router.get("/checkout", viewCheckout);
router.post("/chekout", userRequireAuth, postCheckout);
router.post("/order-wallet", checkWallet);
router.get("/success", userRequireAuth, successPage);
router.post("/failed-payment", userRequireAuth, failedPayment);
router.post("/retry-payment", userRequireAuth, retryPayment);
router.get("/failed", failedPage);
router.post("/create-order", userRequireAuth, createOrder);
router.post("/verify-payment", userRequireAuth, verifyPayment);
// router.get('/success',createOrder)
module.exports = router;
