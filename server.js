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
// the http service. socket.io defaults to using long polling over the 
// http connection and tries to upgrade the connection to use
// WebSockets, which is a different protocol (ws) than http. It uses the 
// same port as the http service.
//
// To ensure we use websockets, we have set the order of the transport to 
// prefer the websocket transport
// 
// @see https://stackoverflow.com/questions/10112178/differences-between-socket-io-and-websockets
// @see https://github.com/socketio/socket.io-client/issues/883
const io = require('socket.io')(http, {
  transports: ['websocket', 'polling']
});

// Serve up static assets (usually in production on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Socket.io event handler listening for
// client connections. When a client connects,
// a realtime socket between the client and the server
// is opened using WebSockets
io.on('connection', (socket) => {
  console.log('Socket connected: ', socket.id);
  
  // when the socket is closed, e.g., when a web page closes or is refreshed
  // a socket disconnect event happens
  socket.on('disconnect', () => {
    console.log('Socket disconnected: ', socket.id);
  });

  // listening for 'chat message' events
  socket.on('chat message', (msg, fn) => {
    console.log('message: ' + msg);
    if(!msg.username) {
      msg.username = "Anonymous";
    }
    fn("Got your message");
    // broadcast the new msg to those clients listening for 'chat message' events
    // The broadcast object on this socket doesn't send the message back to its destination
    socket.broadcast.emit('chat message', msg);
  });
});

// When in production, send every unhandled request to the React app by refreshing the public index.html
// When in development, the webpack dev server catches these requests at localhost:3000
// Note: define any API routes before this runs
app.get("*", function(req, res) {
  console.log("Got a request for the client,eh?...probably handled by React Router");
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// Start listening for requests on the PORT established at the top
http.listen(PORT, function() {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
});
