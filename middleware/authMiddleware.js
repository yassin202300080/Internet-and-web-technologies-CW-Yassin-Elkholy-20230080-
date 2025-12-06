const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    //get the token from the header
    const authHeader = req.headers.authorization;

    //check if it exists and starts with a bearer token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ error: 'Access denied: Token missing' });
    }

    //extract the actual token string
    const token = authHeader.split(' ')[1];

    //verify the token using secret Key
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

        //attach user info  to the request for Controllers to use it
        req.user = { id: decoded.id, role: decoded.role };
        next();
    });
};

module.exports = verifyToken;

