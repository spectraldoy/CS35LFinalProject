// NOTE: This is the new version of the grading scheme schema

const mongoose = require("mongoose");


const GradingScheme = new mongoose.Schema({        // NOTE: the names of the properties must be exactly the same as those in the JSON received
    owner: String,          // This will be the username of the creator of this scheme
    university: String,     // TODO: Replace this with a university ID in order to have a consistent reference to universities
    professor: String,
    class: String,

    categories: 
    [{
        name: String,
        weight: Number
    }]
});

module.exports = mongoose.model("grading_scheme_model", GradingScheme);