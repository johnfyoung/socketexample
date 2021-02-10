const express = require("express");
const path = require("path");

// If the runtime environment has a PORT environment variable, use that 
// to establish our host port. If not, use 3001.
const PORT = process.env.PORT || 3001;

// Create an Express app
const app = express();

// Assign that Express app to be a handler to an http server 
const http = require('http').createServer(app);

// This will create a socket io instance that can also utilize
// the http service. socket.io will try to use WebSockets, which 
// is a different protocol (ws) than http. It will use the 
// same port as the http service. If WebSockets are unavailable 
// due to an old browser, socket.io will try to use AJAX polling
// from the client to see if there are any new socket events
// @see https://stackoverflow.com/questions/10112178/differences-between-socket-io-and-websockets
const io = require('socket.io')(http);

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Socket.io event handler listening for
// client connections. When a client connects,
// a realtime socket between the client and the server
// is opened using WebSockets
io.on('connection', (socket) => {
  console.log('a user connected');
  
  // when the socket is closed, e.g., when a web page closes or is refreshed
  // a socket disconnect event happens
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  // listening for 'chat message' events
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);

    // broadcast the new msg to those clients listening for 'chat message'
    // events
    io.emit('chat message', msg);
  });
});

// Send every request to the React app
// Define any API routes before this runs
app.get("*", function(req, res) {
  console.log("Got a request for the client eh")
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// Start listening for requests on the PORT established at the top
http.listen(PORT, function() {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
});
