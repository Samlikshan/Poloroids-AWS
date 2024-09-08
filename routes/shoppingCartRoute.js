let express = require("express");
let router = express.Router();
const userRequireAuth = require("../middleware/userRequireAuth");
const {
  addToCart,
  viewCart,
  updateitem,
  checkout
} = require("../controllers/shoppingCartController");

router.use(userRequireAuth);

router.get("/", viewCart);
router.post("/add-to-cart", addToCart);
router.post("/updateItem", updateitem);
router.get('/cart-checkout',checkout)
module.exports = router;
