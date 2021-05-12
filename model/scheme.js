const mongoose = require("mongoose");


const Scheme = new mongoose.Schema({        // NOTE: the names of the properties must be exactly the same as those in the JSON received
    uni: String,
    course: String, 
    prof: String,
    categories: [
        {
            name: String,
            weight: Number
        }]
});

module.exports = mongoose.model("scheme", Scheme);