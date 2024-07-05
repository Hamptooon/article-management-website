const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'] ;
    if (!token) return res.sendStatus(401);
    console.log(token);
    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err){
            console.log("---");
            return res.sendStatus(403);
        }
        console.log(user);
        req.user = user;
        next();
    });
};

const authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            console.log(req.user.role);
            console.log("+++");
            return res.status(403).json({ message: 'Access denied' });
        }
        console.log(req.user.role);
        next();
    };
};

module.exports = { authenticateToken, authorizeRole };
