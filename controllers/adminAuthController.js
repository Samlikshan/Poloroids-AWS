const Admin = require('../models/adminModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const getLogin = (req,res)=>{
    res.render('admin/login')
}

const postLogin = async (req,res)=>{
    let {username,password} = req.body
    
    let admin = await Admin.findOne({username:username})
    
    if(admin){
        password = await bcrypt.compare(password, admin.password)
        
        if(password){
            let token = jwt.sign({username,role:'admin'},process.env.SECRET_KEY,{ expiresIn: '1d' })
            res.cookie('Token',token)
            res.status(200).json({token})
        }else{
            res.status(401).json({message:'Username or Password in incorrect'})
        }
    }else{
        res.status(401).json({message:'Admin not found'})
    }
}

const logout = (req,res) => {
    console.log('req');
    
    res. clearCookie('Token')
    res.redirect('/admin/login')
}

module.exports = {
    getLogin,
    postLogin,
    logout    
}