import logo from "/logo.png";
import "./App.css";
import { onChildAdded, push, ref, set } from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { database, storage } from "./firebase";
import { useState, useEffect } from "react";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
//save image key
const STORAGE_KEY = "images/";

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState([]);
  const [fileInputFile, setFileInputFile] = useState(null);
  const [fileInputValue, setFileInputValue] = useState("");

  useEffect(() => {
    const messagesRef = ref(database, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      setMessages((prevState) =>
        // Store message key so we can use it as a key in our list items when rendering messages
        [
          ...prevState,
          {
            key: data.key,
            val: data.val(),
          },
        ]
      );
    });
  }, []);

  const writeData = (url) => {
    console.log(url);
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      MessageText: newMessage,
      Timestamp: new Date().toLocaleTimeString(),
      url: url,
    });
    setNewMessage("");
    setFileInputFile(null);
    setFileInputValue("");
  };

  //function to upload images
  const submit = (e) => {
    e.preventDefault();
    const fullStorageRef = storageRef(
      storage,
      STORAGE_KEY + fileInputFile.name
    );
    console.log(fullStorageRef);

    uploadBytes(fullStorageRef, fileInputFile).then(() => {
      getDownloadURL(fullStorageRef).then((url) => {
        writeData(url);
      });
    });
  };

  // Convert messages in state to message JSX elements to render
  let messageListItems = messages.map((message) => (
    <li key={message.key}>
      {message.val.MessageText} {message.val.Timestamp}{" "}
      <img src={message.val.url} alt={message.val.url} />
    </li>
  ));

  return (
    <>
      <div>
        <img src={logo} className="logo" alt="Rocket logo" />
      </div>
      <h1>Instagram Bootcamp</h1>
      <div className="card">
        <form>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
            }}
          />
          <input
            type="file"
            value={fileInputValue}
            onChange={(e) => {
              setFileInputFile(e.target.files[0]);
              setFileInputValue(e.target.value);
            }}
          />
          <button onClick={submit}>Send</button>
        </form>
        <ol>{messageListItems}</ol>
      </div>
    </>
  );
}

export default App;
