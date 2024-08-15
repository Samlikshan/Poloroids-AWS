let express = require('express');
const getHome = require('../controllers/homeController');
const getProducts = require('../controllers/shopContoller');
const userRequireAuth = require('../middleware/userRequireAuth');
const singleProduct = require('../controllers/userProductController');

let router = express.Router();

/* GET home page. */
router.get('/',getHome);

router.get('/shop',getProducts)
router.get('/account',userRequireAuth,(req,res)=>{
    res.send('account')
})

router.get('/shop/:id',singleProduct)

module.exports = router;
