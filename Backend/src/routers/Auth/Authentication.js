// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const accessTokenSecret = process.env.accessTokenSecret

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        console.log(token);
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403).json({
                    code : 403,
                    message : "token expired"   
                });
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

module.exports = authenticateJWT;
