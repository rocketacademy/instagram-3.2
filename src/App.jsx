import logo from "/logo.png";
import "./App.css";
import {
  onChildAdded,
  push,
  ref,
  set,
  remove,
  onChildRemoved,
} from "firebase/database";
import { database } from "./firebase";
import { useState, useEffect } from "react";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const messagesRef = ref(database, DB_MESSAGES_KEY);

  useEffect(() => {
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      setMessages((prev) =>
        // Store message key so we can use it as a key in our list items when rendering messages
        [...prev, { key: data.key, val: data.val() }]
      );
    });
    onChildRemoved(messagesRef, () =>
      setMessages((prev) => prev.toSpliced(-1, 1))
    );
  }, []); // eslint-disable-line

  const writeData = () => {
    const newMessageRef = push(messagesRef);
    set(newMessageRef, { Timestamp: `${Date()}`, Message: inputMessage });
  };

  const deleteData = () => remove(messagesRef);

  // Convert messages in state to message JSX elements to render
  const messageListItems = messages.map((message) => {
    return (
      <li key={message.key}>
        <span className="text-messages">{message.val.Message}</span>
        <br />
        <span className="timestamp">
          {new Date(message.val.Timestamp).toLocaleString()}
        </span>
      </li>
    );
  });

  return (
    <>
      <div>
        <img src={logo} className="logo" alt="Rocket logo" />
      </div>
      <h1>Instagram Bootcamp</h1>
      <div className="card">
        {/* TODO: Add input field and add text input as messages in Firebase */}
        <form onSubmit={(e) => (e.preventDefault(), e.target.reset())}>
          <input
            type="text"
            onChange={(e) => setInputMessage(e.target.value)}
          />{" "}
          <button onClick={writeData}>Send</button>
          <button onClick={deleteData}>NUKE NUDES</button>
        </form>
        <ul className="message-box">{messageListItems}</ul>
      </div>
    </>
  );
}
