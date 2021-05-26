const express = require("express");
const mongoose = require("mongoose");

const User = require("../model/user");
const GradingScheme = require("../model/grading_scheme");   // NEW GRADING SCHEME
const { default: userEvent } = require("@testing-library/user-event");

require("dotenv/config");               // Allow us to use a .env file containing our credentials for the database

const PORT = process.env.PORT || 3001;  // Our port defaults to port 3001 (if no port is provided)

const app = express();

// following links client to server, sourced from:
// https://stackoverflow.com/questions/58450951/blocked-by-cors-policy-error-when-calling-to-mongo-golang-db-with-angular-web-ap
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});


app.use(express.json());        // express.json is the middleware that processes JSON files sent to the server





// Here, we're setting up the callback function for when a client sends a get request at the /api endpoint.
// Remember that an API endpoint is simply a "location" at which a client can send requests to the server.
// I believe the callback function has some kind of signature like   void getCallback(Request& req, Response& res)
// It appears as if this callback function's purpose is to modify the GET Response object before it is sent to the client

app.get("/api", (req, res) => 
{
    res.send("Hello there!");
});


// For get requests, we use req.query to retrieve the query parameters we send through Postman. I assume that the client
// would simply have to append the query parameters to the API endpoint (URL) in order to make this get request





app.get("/grading_schemes", async (req, res) =>
{

    // otherwise just use search query
    let requestedSchemes = await GradingScheme.find(
        { $or: [
            { owner: req.query.owner },
            { university: req.query.university },
            { professor: req.query.professor },
            { class: req.query.class },
            { _id: req.query.id}
        ]}, 
        (err, schemes) => {}
    );
    
    res.send(requestedSchemes);
});

app.get("/searchquery", async (req, res) => {
    if (!req.query.string) {
        res.send("");
        return;
    }
    // the search string will be of the form withPunctuation + '`' + withoutPunctuation
    // and is parsed accordingly by the following code
    let requestString = req.query.string; 
    let searches = requestString.split("`");
    let parsedSearches = [];
    if (searches.length == 1) // in case ` was not in the string
        parsedSearches = [searches[0].split(" "), searches[0].split(" ")];
    else
        parsedSearches = [searches[0].split(" "), searches[1].split(" ")];
    // brute force search
    let requestedSchemes = await GradingScheme.find(
        { $or: [
            { owner: { $in: [...parsedSearches[1]] } },
            { university: { $in: [...parsedSearches[0]] } },
            { professor: { $in: [...parsedSearches[0]] } },
            { class: { $in: [...parsedSearches[1]] } },
        ]},
        (err, schemes) => {}
    );

    res.send(requestedSchemes);
})

app.get("/all_schemes", async (req, res) => 
{
    var allSchemes = await GradingScheme.find({}, (err, grading_schemes) => {});
    res.send(allSchemes);
});

app.get("/users", async (req, res) => 
{
    try
    {

        var userAccount = await User.findOne({ "username": req.query.username, "password": req.query.password}, 
            (err, userEvent) => {});
        if(userAccount != null)
            // for easier my univ's schemes view
            res.send("0" + userAccount.university);        // Credentials are correct; account exists          
        else
        {
            userAccount = await User.findOne({ "username": req.query.username}, (err, userEvent) => {});
            if(userAccount != null)
                res.send("1");    // Error code 1: Account exists, but credentials are wrong
            else
                res.send("2");    // Error code 2: Account does not exist
        }
    
    }
    catch(err)
    {
        res.send({message: err});
    }
});





// NOTE: As of now, there is no front-end for scheme saving, so in order to test out the database, 
// you may want to use Postman or REST and send over a JSON object in the same format as the Scheme model in scheme.js




app.post("/grading_schemes", async (req, res) =>
{
    try
    {
        const newGradingScheme = new GradingScheme(req.body);
        await newGradingScheme.save();

        console.log("Saved new grading scheme for class \"" + req.body.class + "\" by user \"" + req.body.owner + "\"");
        res.send("Saved new grading scheme for class \"" + req.body.class + "\" by user \"" + req.body.owner + "\"");
    }
    catch (err)
    {
        res.send({message: err});
    }
});

app.post("/users", async (req, res) =>
{
    try
    {

        // TODO: We need a way of automatically assigning a new unique userID when a new user is created
        // There may be a way to store this data on the database (like find the last user to be added
        // and then add 1 to that user's ID)
        const existingUser = await User.findOne({ "username": req.body.username }, (err, grading_schemse) => {});
        if(existingUser != null)
        {
            res.send("User already exists!");   // We may want to send over a number as a way of specifying the error?
            console.log("User already exists!");
            return;
        }
        const newUser = new User(req.body);
        await newUser.save();

        console.log("Saved new user \"" + req.body.username + "\"");
        res.send("Saved new user \"" + req.body.username + "\"");
    }
    catch(err)
    {
        res.send({message: err});
    }
});




// NOTE: Remember to install the dotenv package and then create a new file called .env within this project folder.
// Within this file, you must declare a variable called DB_CONNECTION_STRING and set it equal to the string that
// MongoDB provides you with (substituting in your database username and password)

// This line lets us connect to our scheme database
mongoose.connect(
    process.env.DB_CONNECTION_STRING,           // The DB_CONNECTION_STRING should be in a private file called .env in the project with your specific connection string
    {useNewUrlParser: true, useUnifiedTopology: true},
    (req, res) =>
    {
        console.log("Connected to the SCHEME database");
    }
);


// What we're doing here is essentially telling our server to set up an event listener that will allow it to
// immediately detect when a request has come in through a specific port 
// I believe the client specifies the port it wants to request through in the URL 
app.listen(PORT, () => 
    {
        console.log(`Server listening on ${PORT}`);     // Note the use of the ` quote instead of ' or " -- ` encloses a formatted string
    });