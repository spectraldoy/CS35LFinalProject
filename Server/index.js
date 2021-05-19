const express = require("express");
const mongoose = require("mongoose");
const Scheme = require("../model/scheme");      // OLD GRADING SCHEME -- USE GradingScheme instead

const User = require("../model/user");
const GradingScheme = require("../model/grading_scheme");   // NEW GRADING SCHEME
const { default: userEvent } = require("@testing-library/user-event");

require("dotenv/config");               // Allow us to use a .env file containing our credentials for the database

const PORT = process.env.PORT || 3001;  // Our port defaults to port 3001 (if no port is provided)

const app = express();

// var cors = require("cors");
// app.use(cors());

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


// OUTDATED!  \/\/\/\/  
app.get("/get_scheme", async (req, res) =>
{
    professor = req.query.professsor;
    var requestedSchemes = await Scheme.find({ "prof": req.query.professor }, (err, schemes) => {});

    res.send(requestedSchemes);
});
// OUTDATED!  /\/\/\/\




app.get("/grading_schemes", async (req, res) =>
{
    search_creatorID = req.query.creatorID;
    search_professor = req.query.professor;

    var requestedSchemes;

    if(search_creatorID != undefined)
        requestedSchemes = await GradingScheme.find({ "creatorID": search_creatorID }, (err, grading_schemes) => {});
    else if(search_professor != undefined)
        requestedSchemes = await GradingScheme.find({ "professor": search_professor }, (err, grading_schemes) => {});
    else
    {
        res.send({message: "ERROR: Invalid query"});
        return;
    }
    
    res.send(requestedSchemes);

    console.log("userID requested: " + search_creatorID);
});

app.get("/users", async (req, res) => 
{
    try
    {
        var userAccount = await User.findOne({ "username": req.query.username, "password": req.query.password}, 
            (err, userEvent) => {});
        
        if(userAccount != null)
            res.send(userAccount);
        else
            res.send("");           // Empty return string signals that account could not be found
    
    }
    catch(err)
    {
        res.send({message: err});
    }
});





// NOTE: As of now, there is no front-end for scheme saving, so in order to test out the database, 
// you may want to use Postman or REST and send over a JSON object in the same format as the Scheme model in scheme.js


// OUTDATED!  \/\/\/\/  Use app.post("/grading_schemes"...) !!!
app.post("/create_scheme", async (req, res) =>
{
    try
    {
        const newScheme = new Scheme(req.body);     // Here we attempt to construct a Scheme object from the JSON the server receives
        await newScheme.save();                     // Attempts to save the newly constructed Scheme object in database


        console.log("Received scheme for course \"" + req.body.course + "\"");   // This is a message for the server

        let cat_names = "";
        for(var i = 0; i < req.body.categories.length; i++)     // We combine all the category names into a comma-sep string
        {
            cat_names += req.body.categories[i].name;
            if(i != req.body.categories.length - 1)
                cat_names += ", ";
        }
        res.send(`Successfully saved scheme for course "${req.body.course}" with categories: ${cat_names}`); // This is a message for the client
    }
    catch (err)
    {
        res.send({ message: err });     // Send back an object containing the error we found
    }
    
});
// OUTDATED!  /\/\/\/\




app.post("/grading_schemes", async (req, res) =>
{
    try
    {
        const newGradingScheme = new GradingScheme(req.body);
        await newGradingScheme.save();

        console.log("Saved new grading scheme for class \"" + req.body.class + "\" by userID \"" + req.body.creatorID + "\"");
        res.send("Saved new grading scheme for class \"" + req.body.class + "\" by userID \"" + req.body.creatorID + "\"");
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