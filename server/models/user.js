const mongoose = require ("mongoose");

const userSchema = new mongoose.Schema({
    name: {type : String, required : true, Unique : true},
    email:{type :String, required: true, Unique: true},
    password: {type : String, required: true},
    role :{ type : String, enum:["user", "admin"], default: "user"}
});

module.exports= mongoose.model("User", userSchema);



