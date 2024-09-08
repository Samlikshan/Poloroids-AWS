require('dotenv').config()
const Product = require('../models/productModel')


// const getBanner = async ()=>{
//     try{
//     let banner = await Banner.find()
//     return banner
//     }catch (error){
//         console.log(error)
//         return []
//     }
// }

const getProdcts = async ()=> {
    try{
        let products = await Product.find({availability:true}).limit(3)
        return products
    }catch (error){
        console.log(error)
        return []
    }
}

const getHome = async (req,res)=>{
    // let banner = getBanner()
    let products = await getProdcts()   
    res.render('user/home',{products})
    
}


const logout = (req,res)=>{
    res.clearCookie("Token");
    res.redirect('/shop')
}

module.exports = {
    getHome,
    logout
}