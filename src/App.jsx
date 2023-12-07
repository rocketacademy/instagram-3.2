import logo from "/logo.png";
import "./App.css";
import { onChildAdded, push, ref, set } from "firebase/database";
import { database } from "./firebase";
import { useState, useEffect } from "react";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
const currentDate = new Date().toString();
console.log(currentDate);

function App() {
  const [messages, setMessages] = useState([]);
  const [inputTextValue, setInputTextValue] = useState("");

  useEffect(() => {
    const messagesRef = ref(database, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      setMessages((prevState) =>
        // Store message key so we can use it as a key in our list items when rendering messages
        [...prevState, { key: data.key, val: data.val() }]
      );
    });
  }, []);

  const writeData = (e) => {
    e.preventDefault();
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      Comment: inputTextValue,
      Timestamp: currentDate,
    });
    setInputTextValue("");
  };

  // Convert messages in state to message JSX elements to render

  //real time refreshing/shifting
  let messageListItems = messages.reverse().map((message) => (
    <li key={message.key}>
      {message.val.Timestamp}-{message.val.Comment}
    </li>
  ));

  return (
    <>
      <div>
        <img src={logo} className="logo" alt="Rocket logo" />
      </div>
      <h1>Instagram Bootcamp</h1>
      <div className="card">
        <form onSubmit={writeData}>
          <input type="text" value={inputTextValue} onChange={(e) => setInputTextValue(e.target.value)} />
          <br />
          <input type="submit" value="submit" />
        </form>
        <ul>{messageListItems}</ul>
      </div>
    </>
  );
}

export default App;
