// NOTE: This is OUTDATED -- use grading_scheme.js instead

const mongoose = require("mongoose");
const user = require("./user");

// TODO: Test to see if successfully attaches user object to scheme object on database when given a valid object ID
// TODO: Implement a search-by-user GET handler that returns a list of schemes made by a given user
const Scheme = new mongoose.Schema({        // NOTE: the names of the properties must be exactly the same as those in the JSON received
    owner: {type: mongoose.Schema.Types.ObjectId, ref: "user"},     // This should be the OBJECT ID (not userID of the user who created this scheme)
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