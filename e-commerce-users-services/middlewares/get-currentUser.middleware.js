const jwt = require('jsonwebtoken');


const getCurrentUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token.' });
    };
};



module.exports = {
    getCurrentUser,
};