const bcrypt = require("bcryptjs");
const jwt= require("jsonwebtoken");
const User = require ("../models/user");

//signup Endpoint Logic
exports.signup = async (req,res)=>{
    const {email, password} =req.body;

    const exists = await User.findOne ({email});
    if (exists) return res.status (400).json({message:"user already exists"});

    const hashed = await bcrypt.hash(password,16);
    const User = await User.create({email, password: hashed});

    const token = jwt.sign({id:User._id, role : User.role}, Process.env.JWT_SECRET, expiresIn ('1h'));
    res.json(token);
};

//Login Endpoint Logic
exports.login = async (req,res) => {
    const {email, password} = req.body;

    const User = await User.findOne ({email});
    if (!User) return res.status (404).json({message:"User Not Found"});

    const match = await bcrypt.compare(password, User.password);
    if (!match) return res.status (401).json ({message:"incorrect password"});

    const token = jwt.sign ({id: User._id, role: User.role}, Process.env.JWT_SECRET);
    res.json(token);
};
