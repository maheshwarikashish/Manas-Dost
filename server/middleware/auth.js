const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate regular users
const auth = async (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach the full user object (without password) to the request
        req.user = await User.findById(decoded.user.id).select('-password');
        if (!req.user) {
            return res.status(401).json({ msg: 'Authorization denied, user not found' });
        }
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Middleware to authenticate administrators
const adminAuth = async (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.user.id);

        if (!user) {
            return res.status(401).json({ msg: 'User not found, authorization denied' });
        }

        // Check if the user's email matches the admin email from environment variables
        if (user.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({ msg: 'Forbidden: Admin access required' });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = { auth, adminAuth };
