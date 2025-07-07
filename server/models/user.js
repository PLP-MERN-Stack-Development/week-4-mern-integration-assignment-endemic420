const mongoose = require ("mongoose");

const userSchema = new mongoose.Schema({
    username: {type : String, required : true, Unique : true},
    email:{type :String, required: true, Unique: true},
    password: {type : String, required: true},
    role :{ type : String, enum:["blogger, admin"], default: "blogger"}
});

module.exports= mongoose.model("User", userSchema);



