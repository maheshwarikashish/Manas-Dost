const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('Token validation failed:', err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

const adminAuth = (req, res, next) => {
    auth(req, res, () => {
        if (req.user.role !== 'admin') {
            console.log('Admin access denied for user:', req.user.id);
            return res.status(403).json({ msg: 'Admin resources access denied' });
        }
        next();
    });
};

module.exports = { auth, adminAuth };