const jwt = require("jsonwebtoken");

function authMiddleWare(req, res, next)
{
    const authHeader = req.headers.authorization;

    if(!authHeader)
    {
        return res.status(401).json({message: "No token provided"});
    }

    const token = authHeader.split(" ")[1];

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decode.userId;
        next();

    }catch(e)
    {
        console.log(e);
        return res.status(401).json({message: "Invalid Token"})
    }
    
}

module.exports = authMiddleWare;