import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const styles = {

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
        setMessages(m => [...m, {...msg, isMe: false}]);
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
      setMessages([...messages, {msg:msgInput, username: userName ? "me" : "me (as Anonymous)", isMe: true}]);
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
    <div className="App container">
      <div className="row d-flex main-row">
        <div className="col-xs-12 col-md-8 col-xl-6 main-container">
          <div className="messageContainer" ref={messagesEl}>
            {messages && messages.map(msg => <p className={`message ${msg.isMe ? 'message-me' : 'message-notme'}`} key={Math.floor(Math.random() * 100000)}><span className="message-sender">{msg.username}</span><br/>{msg.msg}</p>)}</div>

          <form>
            <div className="msginput my-2">
              <input type="text" name="msgInput" value={msgInput} onChange={handleTypeMessage} style={{flexGrow: 1}}/>
              <button type="submit" onClick={handleMessageSend} className="ml-2">Send!</button>
            </div>
          </form>
          <div className="d-flex d-flex-align-items-center">
            <input placeholder="What's your name?" id="userNameInput" type="text" name="userNameInput" value={userName} onChange={handleChangeUsername} className="mr-2"/> <span className="help-text">(If left blank, you will show as "Anonymous")</span>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default App;
