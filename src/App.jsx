import logo from "/logo.png";
import "./App.css";
import {
  onChildAdded,
  push,
  ref,
  set,
  onChildChanged,
  onChildRemoved,
} from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { database, storage } from "./firebase";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import { useTheme } from "@emotion/react";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
const IMAGE_FOLDER = "images";

//set date
const DATE = new Date().toString();

function App() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [userInputFile, setUserInputFile] = useState([]);
  const [fileInputValue, setFileInputValue] = useState("");

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleImages = (e) => {
    setUserInputFile(e.target.files[0]);
    setFileInputValue(e.target.value);
  };

  //edit messages from firebase
  const editMessage = (key, newText) => {
    const messageRef = ref(database, `${DB_MESSAGES_KEY}/${key}/text`);
    set(messageRef, newText).then(() => {
      console.log("Message edited successfully");
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.key === key
            ? { ...message, val: { ...message.val, text: newText } }
            : message
        )
      );
    });
  };

  // delete messages from firebase
  const removeMessage = (key) => {
    const messageRef = ref(database, `${DB_MESSAGES_KEY}/${key}`);
    set(messageRef, null).then(() => {
      console.log("Message removed successfully");
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.key !== key)
      );
    });
  };

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

    // shows - edit message
    onChildChanged(messagesRef, (data) => {
      // Update the message in local state
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.key === data.key
            ? { key: data.key, val: data.val() }
            : message
        )
      );
    });

    // show that the message has been removed
    onChildRemoved(messagesRef, (data) => {
      // Remove the message from local state
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.key !== data.key)
      );
    });
  }, []);

  const writeData = (e) => {
    e.preventDefault();

    //images
    const fileRef = storageRef(
      storage,
      `${IMAGE_FOLDER}/${userInputFile.name}`
    );

    //upload images
    uploadBytes(fileRef, userInputFile)
      .then(() => getDownloadURL(fileRef))
      .then((downloadURL) => {
        //messages
        const messageListRef = ref(database, DB_MESSAGES_KEY);
        const newMessageRef = push(messageListRef);

        const messageData = {
          text: userInput,
          timestamp: DATE,
          imageURL: downloadURL,
        };

        set(newMessageRef, messageData);
        setUserInput("");
        setUserInputFile("");
        setFileInputValue("");
        console.log("Image URL:", downloadURL);
      })
      .catch((error) => {
        // Handle errors during image upload or URL retrieval
        console.error("Error uploading image or getting URL:", error);
      });
  };

  // Convert messages in state to message JSX elements to render
  let messageListItems = messages.map((message) => (
    <Card variant="outlined" key={message.key}>
      <li>
        <p>{message.val.timestamp}</p>
        <p>{message.val.text}</p>
        <img src={message.val.imageURL} alt="Uploaded" />
        <br />
        <button
          type="edit"
          onClick={() => {
            const newText = prompt("Edit your message:");
            if (newText !== null) {
              editMessage(message.key, newText);
            }
          }}
        >
          Edit
        </button>
        <button type="delete" onClick={() => removeMessage(message.key)}>
          Delete
        </button>
      </li>
    </Card>
  ));

  return (
    <>
      <div>
        <img src={logo} className="logo" alt="Rocket logo" />
      </div>
      <h1>Instagram Bootcamp</h1>
      <div className="card">
        {/* TODO: Add input field and add text input as messages in Firebase */}
        <form onSubmit={writeData}>
          <input type="text" value={userInput} onChange={handleInputChange} />
          <br />
          <br />
          <input type="file" value={fileInputValue} onChange={handleImages} />
          <br />
          <br />
          <button type="submit" onClick={writeData}>
            Submit
          </button>
        </form>
      </div>
      <div>
        <ol>{messageListItems}</ol>
      </div>
    </>
  );
}

export default App;
