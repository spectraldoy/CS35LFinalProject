const express = require("express");

const PORT = process.env.PORT || 3001;  // Our port defaults to port 3001 (if no port is provided)

const app = express();

// Here, we're setting up the callback function for when a client sends a get request at the /api endpoint.
// Remember that an API endpoint is simply a "location" at which a client can send requests to the server.
// I believe the callback function has some kind of signature like   void getCallback(Request& req, Response& res)
// It appears as if this callback function's purpose is to modify the GET Response object before it is sent to the client
app.get("/api", (req, res) => 
{
    res.json({ message: "Hello from server"});
});

app.get("/home", (a, b) =>
{
    b.json({ message: "This is supposed to be the home page!"});
});


// What we're doing here is essentially telling our server to set up an event listener that will allow it to
// immediately detect when a request has come in through a specific port 
// I believe the client specifies the port it wants to request through in the URL 
app.listen(PORT, () => 
    {
        console.log(`Server listening on ${PORT}`);     // Note the use of the ` quote instead of ' or " -- ` encloses a formatted string
    });