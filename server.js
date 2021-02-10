const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

// Send every request to the React app
// Define any API routes before this runs
app.get("*", function(req, res) {
  console.log("Got a request for the client eh")
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

http.listen(PORT, function() {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
});
