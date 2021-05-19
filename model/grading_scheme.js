// NOTE: This is the new version of the grading scheme schema

const mongoose = require("mongoose");
const user = require("./user");


const GradingScheme = new mongoose.Schema({        // NOTE: the names of the properties must be exactly the same as those in the JSON received
    owner: {type: mongoose.Schema.Types.ObjectId, ref: "user"},     // This should be the OBJECT ID (not userID of the user who created this scheme)
    university: String,     // TODO: Replace this with a university ID in order to have a consistent reference to universities
    professor: String,
    class: String,
    creatorID: String,
    schemeID: String,
    categories: 
    [{
        name: String,
        weight: Number
    }]
});

module.exports = mongoose.model("grading_scheme_model", GradingScheme);