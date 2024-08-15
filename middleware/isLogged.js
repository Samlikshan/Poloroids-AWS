require('dotenv').config();
const jwt = require('jsonwebtoken');

const isLogged = (req, res, next) => {
    const token = req.cookies['Token']
    try {
        if (!token) {
            return next();
        }

        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err || !decoded) {
                return next();
            }
            
            return res.redirect('/admin');
        });
    } catch (error) {
        console.error(error); 
        return next(error);
    }
};

module.exports = isLogged;
