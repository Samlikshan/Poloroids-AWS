const Product = require('../models/productModel');
const Offer = require('../models/offerModel');

const singleProduct = async (req, res, next) => {
    let productId = req.params.id;

    let product = await Product.findById(productId);
    let products = await Product.find({ availability: true }).limit(3);
    let offers = await Offer.find({}).populate('typeId');

    let maxDiscount = 0;
    let finalPrice = product.price;

    offers.forEach(offer => {
        if (
            (offer.offerType === 'product' && offer.typeId._id.toString() === productId.toString()) || 
            (offer.offerType === 'brand' && offer.typeId.categoryName.toString() === product.brand.toString()) 
        ) {
            console.log('req')
            // Calculate the highest discount percentage
            if (offer.discountPercentage > maxDiscount) {
                maxDiscount = offer.discountPercentage;
            }
        }
    });

    if (maxDiscount > 0) {
        finalPrice = product.price - (product.price * maxDiscount / 100);
    }
    res.render('user/product', {
        product,
        products,
        finalPrice,
        maxDiscount: maxDiscount > 0 ? maxDiscount  : null
    });
};

const productResponse = async (req,res,next) =>{
    let productId = req.params.id   
    let product = await Product.findById(productId)
    res.status(200).json({product})
}


module.exports = {
    singleProduct,
    productResponse
}