let express = require("express");
let router = express.Router();
const {
  viewCheckout,
  postCheckout,
  successPage
} = require("../controllers/user/checkoutController");

router.get("/checkout", viewCheckout);
router.post("/chekout", postCheckout);
router.get("/success", successPage);

module.exports = router;
