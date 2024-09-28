let express = require("express");
const {getHome,logout} = require("../controllers/homeController");
const {getProducts,sortProducts} = require("../controllers/shopContoller");
const userRequireAuth = require("../middleware/userRequireAuth");
const {singleProduct,productResponse, cartResponse} = require("../controllers/userProductController");
const {
  addAddress,
  viewAddress,
  updateAddress,
  deleteAddress,
  fetchAddress,
  availableAdderss,
} = require("../controllers/user/addressController");
const {viewOrders,singleOrder, cancelOrder, returnOrder , getInvoice} = require('../controllers/user/orderContoller')
const {getUserDetails,editUserDetails} = require('../controllers/user/userProfile')
const { addToWishlist, getWishlist, removeItem } = require('../controllers/user/wishlistController')
const { applyCoupon, getCoupons } = require('../controllers/admin/couponManagement');
const { viewWallet } = require("../controllers/user/walletController");


let router = express.Router();


router.get("/", getHome);
router.get("/logout", logout);

router.get("/shop", getProducts);
router.get("/shop/sort/:order", sortProducts);


// router.get("/account/profile", userRequireAuth,getUserDetails);
router.get('/account/profile',userRequireAuth,getUserDetails)
router.post('/account/profile',editUserDetails)

router.get('/account/orders',viewOrders)
router.get('/account/order/:orderId',singleOrder)
router.post('/account/return-order/:orderId',returnOrder)
router.get('/invoice/:orderId',getInvoice)
router.post('/account/cancel-order/:orderId',cancelOrder)


router.get("/shop/:id", singleProduct);
router.get("/product/:id", productResponse);
router.get('/cart/response',cartResponse)


router.get("/account/address", viewAddress);
router.get('/api/addresses',fetchAddress)
router.post("/account/add-address", addAddress);
router.post("/account/update-address", updateAddress);
router.post("/account/address/delete", deleteAddress);
router.get('/check-address/:addressId',availableAdderss)

router.get('/account/coupons',getCoupons)

router.get('/wishlist',userRequireAuth,getWishlist)
router.post('/add-to-wishlist',addToWishlist) 
router.delete('/remove-wishlsit',removeItem) 


router.get('/account/wallet',viewWallet)

//coupon Management
router.post('/apply-coupon',applyCoupon)
module.exports = router;
