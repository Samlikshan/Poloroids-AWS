const express = require('express');
const router = express.Router();
const multer = require('multer')

const getDashboard = require('../controllers/dashbaordController')
const { listUsers, blockUser, userDetails } = require('../controllers/userController')
const { categories, getEditCategories,postEditCategories, getAddCategory, postAddCategory } = require('../controllers/categoryController');
const { showProducts, getEditProducts, postEditProducts, getAddProduct, postAddProduct, disableProduct } = require('../controllers/productController');




//Auth Management
router.get('/login')
router.post('/signup')
router.post('/verification')
router.get('/reset-password')
router.post('/reset-password')

//dashboard
router.get('/',getDashboard)


//users management
router.get('/users', listUsers)
router.get('/users/:id', blockUser)
router.get('/users/:id',userDetails)


//Category Management
router.get('/categories',categories)
router.get('/edit-category/:id',getEditCategories)
router.post('/edit-category/:id',postEditCategories)
router.get('/add-category',getAddCategory)
router.post('/add-category',postAddCategory)



// Product Management
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'../Polaroids/public/images/')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})

const upload = multer({storage})

router.get('/products',showProducts)
router.get('/edit-product/:id',getEditProducts)
router.post('/edit-product/:id',postEditProducts)
router.get('/add-product',getAddProduct)
router.post('/add-product',upload.array('productImage',4),postAddProduct)
router.get('/disable-product/:id',disableProduct)

module.exports = router  