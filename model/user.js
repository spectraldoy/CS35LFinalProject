const mongoose = require("mongoose");

const User = new mongoose.Schema({
    username: String,
    password: String,
    university: String,

})

module.exports = mongoose.model("user_model", User);