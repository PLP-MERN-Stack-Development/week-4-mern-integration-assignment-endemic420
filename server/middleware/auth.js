const jwt = require("jsonwebtoken");

//checks token and sets req.User
exports.protect = (req,res,next)=>{
    const auth =req.headers.authorization;
    if(!auth || !auth.startsWith("Bearer "))
        return res.status(401).json({message:"No Token Given"})

    const token = auth.split("")[1];
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.User = decoded
        next()
    }catch (error){
        return res.status(403).json({message:"invalid token "});
    }
};

//Check role 
exports.authorize= (roles) =>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role))
            return res.status(403).json({message:"Forbidden"});
        next();
    };
};