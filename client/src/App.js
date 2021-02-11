import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const styles = {
  root: {
    width:"400px",
    margin: "0 auto",
  },
  messageContainer: {
    height:"300px",
    overflow:"scroll",
    padding: "10px",
    background: "#ccc",
  },
  msgInput: {
    display: "flex",
  }
}

function App() {
  // The messages from the socket will be held in an array in a
  // state variable.
  const [messages, setMessages] = useState([]);

  // The socket will be held in a state variable
  const [socket, setSocket] = useState(null);

  // Form inputs
  const [msgInput, setMessageInput] = useState("");
  const [userName, setUsername] = useState("")

  // The element holding the messages
  const messagesEl = useRef(null);

  useEffect(() => {
    if(!socket) {
      // Note: the path to the websocket on the server is hard coded here because it
      // wouldn't proxy from the dev server port (3000) to the server port (3001)
      // This would normally be window.location.href if in production.
      const socket = io(process.env.NODE_ENV === 'production' ? window.location.href : "ws://localhost:3001", { transports: ['websocket', 'polling'] });

      socket.on("connection", (msg) => {
        console.log("socket connected: ", msg);
      });

      /**
       * This sets up an event listener, listening for 'chat message' events broadcasted
       * from the socket hosted on the Express server.
       */
      socket.on('chat message', function(msg) {
        console.log("Got a message: ", msg);

        // this avoids an infinite loop of watching messages as a dependency yet
        // needing to set messages within the socket
        setMessages(m => [...m, msg]);
      });

      setSocket(socket);
    }

  }, [socket, setSocket, setMessages]);

  /**
   * When messages changes, scroll the message container to the bottom
   */
  useEffect(() => resetScrollEffect({ element: messagesEl }), [messages])

  /**
   * Event handler: send message
   */
  function handleMessageSend(e) {
    e.preventDefault();
    if(msgInput) {
      setMessages([...messages, {msg:msgInput, username: "me"}]);
      socket.emit('chat message', {msg: msgInput, username: userName}, (data) => console.log("Server response: ", data))
      setMessageInput("");
    }
  }

  /**
   * Helper function takes a ref and scrolls it to the bottom
   */
  function resetScrollEffect ({ element }) {
    element.current.scrollTop = element.current.scrollHeight;
  }

  /**
   * Event hanlder: message type
   */
  function handleTypeMessage(e) {
    setMessageInput(e.target.value);
  }

  /**
   * Event handler: username type
   */
  function handleChangeUsername(e) {
    setUsername(e.target.value);
  }

  return (
    <div style={styles.root}>

      <div ref={messagesEl} style={styles.messageContainer}>{messages && messages.map(msg => <p key={Math.floor(Math.random() * 100000)}>{`${msg.username}: ${msg.msg}`}</p>)}</div>

      <form>
        <div style={styles.msgInput}>
          <input type="text" name="msgInput" value={msgInput} onChange={handleTypeMessage} style={{flexGrow: 1}}/>
          <button type="submit" onClick={handleMessageSend}>Send!</button>
        </div>
      </form>

      <input placeholder="What's your name?" id="userNameInput" type="text" name="userNameInput" value={userName} onChange={handleChangeUsername} />
    </div>
  );
}

export default App;
