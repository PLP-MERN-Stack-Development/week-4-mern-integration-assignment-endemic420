const mongoose = require ("mongoose");

const userSchema = new mongoose.Schema({
    email:{type :String, required: true},
    password: String,
    role :{ type : String, enum:["blogger, admin"], default: "blogger"}
});

module.exports= mongoose.model("User", userSchema);



