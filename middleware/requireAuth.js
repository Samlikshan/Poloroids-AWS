require('dotenv').config();
const jwt = require('jsonwebtoken');

const requireAuth =async (req, res, next) => {

    let token = await req.cookies['Token'] 
    if (!token) {
        console.log('No token provided');
       return res.redirect('/admin/login')
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if(decoded.role == 'admin'){
            // console.log(decoded);
            
            next()
        }else if(decoded.role == 'user'){
            res.redirect('/')
        }else {
            res.redirect('/admin/login')
        }
    } catch (err) {
        console.log('Token verification failed:', err);
        // return res.status(400).json({ message: 'Invalid token.' });
        res.redirect('/admin/login')
    }
};

module.exports = requireAuth
