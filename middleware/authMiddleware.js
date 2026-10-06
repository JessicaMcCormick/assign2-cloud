const jwt = require("jsonwebtoken");
const JWT_SECRET = "secret-key";

function authenticateToken(req, res, next){
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({ success:false, error: "Token required"});
    }

    jwt.verify(token, JWT_SECRET, function(error, user){
        if (error){
            return res.status(403).json({ success: false, error: "Invalid or expired token"});
        }
        req.user = user;
        next();
    });
}
module.exports = authenticateToken;