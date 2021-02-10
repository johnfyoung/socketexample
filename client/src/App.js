import {useState} from "react";
import logo from './logo.svg';
import './App.css';
import { io } from "socket.io-client";

var socket = io();
function App() {
  // The messages from the socket will be held in an array in a
  // state variable.
  const [messages, setMessages] = useState([]);

  /**
   * This sets up an event listener, listening for 'chat message' events broadcasted
   * from the socket hosted on the Express server.
   */
  socket.on('chat message', function(msg) {

    // this sets the messages state to include the new message
    setMessages([...messages, msg]);
  });

  return (
    <div className="App">

      {/* Clicking this button emits a 'chat message' event to the socket hosted on the Express server, sending the string "Hi there" */}
      <button onClick={() => socket.emit('chat message', "Hi there")}>Click me</button>
      <div>{messages && messages.map(msg => <p>{msg}</p>)}</div>
    </div>
  );
}

export default App;
