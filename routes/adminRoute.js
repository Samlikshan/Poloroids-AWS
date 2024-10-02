const express = require('express');
const router = express.Router();
const multer = require('multer')
const requireAuth = require('../middleware/requireAuth')
const isLogged = require('../middleware/isLogged')
const { getDashboard, getSalesData } = require('../controllers/admin/dashboardController')
const {generatePDFReport, getSalesReport , generateExcelReport} = require('../controllers/salesReportController')
const { listUsers, blockUser, userDetails } = require('../controllers/userController')
const { categories,addCategory, changeCategoryStatus, editCategory } = require('../controllers/categoryController');
const { showProducts, getEditProducts, postEditProducts, getAddProduct, postAddProduct, disableProduct } = require('../controllers/productController');
const { getLogin, postLogin ,logout, getResetPassword, postResetPassword, getNewPassword, postNewPassword, getForgotPasswrod, postForgotPassword } = require('../controllers/adminAuthController');
const { viewOrder, updateOrders, singleOrder } = require('../controllers/admin/orderManagement');
const { viewCoupons, postCoupon, applyCoupon, deleteCoupon } = require('../controllers/admin/couponManagement');
const { viewOffers, addOffer, getEditOffer, postEditOffer, deleteOffer } = require('../controllers/admin/offerManagement');

//Auth Management
router.get('/login',isLogged,getLogin)
router.post('/login' ,isLogged,postLogin)
router.get('/forgot-password',getForgotPasswrod)
router.post('/forgot-password',postForgotPassword)
router.get('/reset-password',getResetPassword)
// router.post('/verification')
router.post('/reset-password',postResetPassword)
router.get('/new-password',getNewPassword)
router.post('/new-password',postNewPassword)
router.get('/logout', logout)


// require Auth to prevent from non logged users to protected routes
router.use(requireAuth)

//dashbaor
router.get('/',getDashboard)
router.get('/sales',getSalesData)

//sales-reoprt
router.get('/sales-report', getSalesReport)
router.get('/report', generatePDFReport)
router.get('/excelReport',generateExcelReport)

//users management
router.get('/users', listUsers)
router.get('/users/:id', blockUser)
router.get('/users/:id', userDetails)


//Category Management
router.get('/categories', categories)
// router.get('/edit-category/:id', getEditCategories)
// router.post('/edit-category/:id', postEditCategories)
// router.get('/add-category', getAddCategory)
router.post('/add-category', addCategory)
router.post('/toggle-status', changeCategoryStatus)
router.post('/edit-category', editCategory)



// Product Management
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../Polaroids/public/images/products')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })

router.get('/products', showProducts)
router.get('/add-product', getAddProduct)
router.post('/add-product', upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'additionalImages', maxCount: 3 }
    ]), postAddProduct)
router.get('/edit-product/:id', getEditProducts)
router.post('/edit-product/:id', upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'replaceImage0', maxCount: 1 },
    { name: 'replaceImage1', maxCount: 1 },
    { name: 'replaceImage2', maxCount: 1 },
    { name: 'newAdditionalImages', maxCount: 3 }
    ]), postEditProducts)
router.get('/disable-product/:id', disableProduct)

//order Management
router.get('/orders',viewOrder)
router.get('/order/:orderId',singleOrder)
router.post('/update-orders',updateOrders)

//coupon Management
router.get('/coupons',viewCoupons)
router.post('/add-coupon',postCoupon)
router.delete('/delete-coupon',deleteCoupon)

//offer Management
router.get('/offers',viewOffers)
router.post('/offers/add',addOffer)
router.get('/offers/edit/:offerId',getEditOffer)
router.post('/offers/edit',postEditOffer)
router.delete('/offers/delete',deleteOffer)

module.exports = router  
