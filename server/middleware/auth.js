const jwt = require('jsonwebtoken');

// Middleware to verify a student or admin token
const auth = (req, res, next) => {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // Add user payload to the request object
        next(); // Move on to the next piece of middleware or the route handler
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Middleware to specifically check for an admin role
const adminAuth = (req, res, next) => {
    // Run the standard auth middleware first
    auth(req, res, () => {
        // After auth, check the user's role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Admin resources access denied' });
        }
        next();
    });
};

module.exports = { auth, adminAuth };