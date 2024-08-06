const express = require('express');
const router = express.Router();

const { listUsers, blockUser, userDetails } = require('../controllers/userController')
const { categories, getEditCategories,postEditCategories, getAddCategory, postAddCategory } = require('../controllers/categoryController');
const { showProducts, getEditProducts, postEditProducts, getAddProduct, postAddProduct, deleteProduct } = require('../controllers/productController');


router.get('/', (req, res) => {
    res.send('welcome to admin dashboard')
})

router.get('/login')
router.post('/signup')
router.post('/verification')
router.get('/reset-password')
router.post('/reset-password')


router.get('/users', listUsers)
router.get('/users/:id', blockUser)
router.get('/users/:id',userDetails)


router.get('/categories',categories)
router.get('/edit-category/:id',getEditCategories)
router.post('/edit-category/:id',postEditCategories)
router.get('/add-category',getAddCategory)
router.post('/add-category',postAddCategory)


router.get('/products',showProducts)
router.get('/edit-product/:id',getEditProducts)
router.post('/edit-product/:id',postEditProducts)
router.get('/add-product',getAddProduct)
router.post('/add-product',postAddProduct)
router.post('/delete-product/:id',deleteProduct)

module.exports = router  