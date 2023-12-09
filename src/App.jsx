import logo from "/logo.png";
import "./App.css";
import {
  onChildAdded,
  push,
  ref,
  set,
  remove,
  update,
  onChildRemoved,
  onChildChanged,
} from "firebase/database";
import { database } from "./firebase";
import { useState, useEffect } from "react";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isEditing, setIsEditing] = useState([]);
  const [editValue, setEditValue] = useState("");

  const messagesRef = ref(database, DB_MESSAGES_KEY);

  useEffect(() => {
    onChildAdded(messagesRef, (data) =>
      setMessages((prev) => [...prev, { key: data.key, val: data.val() }])
    );
    onChildRemoved(messagesRef, (data) =>
      setMessages((prev) => prev.filter((item) => item.key !== data.key))
    );
    onChildChanged(messagesRef, (data) =>
      setMessages((prev) =>
        prev.map((item) =>
          item.key === data.key ? { key: data.key, val: data.val() } : item
        )
      )
    );
  }, []); // eslint-disable-line

  useEffect(() => {
    setIsEditing(messages.map(() => false));
  }, [messages]);

  const writeData = () =>
    set(push(messagesRef), {
      timestamp: `${new Date()}`,
      edited: ``,
      message: inputValue,
    });

  const deleteAll = () => remove(messagesRef);

  const editData = (data, i) => {
    setIsEditing((prev) => prev.map((item, j) => (i === j ? !item : item)));
    if (isEditing[i]) {
      update(ref(database, DB_MESSAGES_KEY + "/" + data.key), {
        edited: `${new Date()}`,
        message: editValue,
      });
    }
  };

  const deleteData = (data) =>
    remove(ref(database, DB_MESSAGES_KEY + "/" + data.key));

  // Convert messages in state to message JSX elements to render
  const messageListItems = messages.map((message, index) => {
    return (
      <li key={message.key}>
        {isEditing[index] ? (
          <input
            type="text"
            value={editValue || message.val.message}
            onChange={(e) => setEditValue(e.target.value)}
          />
        ) : (
          <div className="text-messages">{message.val.message}</div>
        )}
        <div className="edit-delete">
          <button onClick={() => editData(message, index)}>Edit</button>
          <button onClick={() => deleteData(message)}>Delete</button>
        </div>
        <div className="info">
          <span style={{ paddingRight: "1.325em" }}>Sent: </span>
          {new Date(message.val.timestamp).toLocaleString()}
          {message?.val?.edited && (
            <>
              <br />
              <span>Edited: </span>
              {new Date(message.val.edited).toLocaleString()}
            </>
          )}
        </div>
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
          <input type="text" onChange={(e) => setInputValue(e.target.value)} />{" "}
          <button onClick={() => writeData()}>Send</button>
          <button onClick={() => deleteAll()}>NUKE</button>
        </form>
        <ul className="message-box">{messageListItems}</ul>
      </div>
    </>
  );
}
