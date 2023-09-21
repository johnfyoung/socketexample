const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// If the runtime environment has a PORT environment variable, use that
// to establish our host port. If not, use 3001.
const PORT = process.env.PORT || 3001;

// Create an Express app
const app = express();

// Set up Handlebars.js engine with custom helpers
const hbs = exphbs.create({ helpers });

const sess = {
  secret: 'Super secret secret',
  cookie: {
    maxAge: 300000,
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

// Inform Express.js on which template engine to use
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

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
  transports: ['websocket', 'polling'],
});

app.use(session(sess));

// Inform Express.js on which template engine to use
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

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
    if (!msg.username) {
      msg.username = 'Anonymous';
    }
    fn('Got your message');
    // broadcast the new msg to those clients listening for 'chat message' events
    // The broadcast object on this socket doesn't send the message back to its destination
    socket.broadcast.emit('chat message', msg);
  });
});

app.use(routes);

// Start listening for requests on the PORT established at the top
sequelize.sync({ force: false }).then(() => {
  http.listen(PORT, () => console.log(`🌎 ==> Server now on port ${PORT}!`));
});
