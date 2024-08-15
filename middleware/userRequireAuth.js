require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const userRequireAuth = async (req, res, next) => {
    let token = await req.cookies['Token']

    try {
        if (!token) {
            res.redirect('/auth/login')

        }else{
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            console.log(decoded.role);
            
            if(decoded.role == 'user'){
                next()
            }else if(decoded.role == 'admin'){
                res.redirect('/admin')
            }else {
                res.redirect('/auth/login')
            }
        }

    } catch (error) {
        console.log(error);

    }
}

module.exports = userRequireAuth