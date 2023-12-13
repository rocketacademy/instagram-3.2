import logo from "/logo.png";
import { onChildAdded, push, ref, set } from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { database, storage } from "../firebase";
import { useState, useEffect } from "react";
import FirebaseDisplay from "./FirebaseDisplay";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
//save image key
const STORAGE_KEY = "images/";

function FirebaseForm(props) {
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
      user: props.user.email,
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

  return (
    <>
      <div className="card">
        {props.user.email != {} ? <p>Welcome {props.user.email}!</p> : null}
        {props.isLoggedIn ? (
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
        ) : null}
        <FirebaseDisplay
          messages={messages}
          isLoggedIn={props.isLoggedIn}
          user={props.user}
        />
      </div>
    </>
  );
}

export default FirebaseForm;
