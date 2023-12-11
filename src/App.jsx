import logo from "/logo.png";
import "./App.css";
import { onChildAdded, push, ref, set } from "firebase/database";
import { db } from "./firebase";
import { useState, useEffect } from "react";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";

function App() {
  const [messages, setMessages] = useState([]);
  const [textInputValue, setTextInputValue] = useState("");

  useEffect(() => {
    const messagesRef = ref(db, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      setMessages((prevState) =>
        // Store message key so we can use it as a key in our list items when rendering messages
        [...prevState, { key: data.key, val: data.val() }]
      );
    });
  }, []);

  const writeData = () => {
    const messageListRef = ref(db, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      textContent: textInputValue,
      time: new Date().toLocaleTimeString(),
    });
    setTextInputValue("");
  };

  // Convert messages in state to message JSX elements to render
  let messageListItems = messages.map((message) => (
    <li key={message}>
      <div className="message">
        <div className="pfp-container">
          <img src={logo} className="logo" alt="Rocket logo" />
        </div>
        <p className="message-content">{message.val.textContent}</p>{" "}
        <small className="message-time-stamp">{message.val.time}</small>
      </div>
    </li>
  ));

  return (
    <div className="chat">
      <h1 className="chatroom-header">Test Chat</h1>
      <div className="card">
        <div className="messages-container">
          <ul className="message-list" style={{ listStyle: "none" }}>
            {messageListItems}
          </ul>
        </div>
        <div className="text-message-input">
          <input
            autoFocus={true}
            placeholder="Write message..."
            type="text"
            name=""
            id=""
            value={textInputValue}
            onChange={(e) => setTextInputValue(e.target.value)}
            className="message-field"
          />
          <button onClick={writeData}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
