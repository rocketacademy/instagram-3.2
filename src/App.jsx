import logo from "/logo.png";
import "./App.css";
import {
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  push,
  ref as databaseRef,
  set,
  remove,
  update,
} from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { database, storage, auth } from "./firebase";
import { useState, useEffect } from "react";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
const DB_IMAGES_KEY = "images";

export default function App() {
  //capture message
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  //capture edit
  const [isEditing, setIsEditing] = useState([]);
  const [editValue, setEditValue] = useState("");
  //capture file
  const [file, setFile] = useState(null);

  const messagesRef = databaseRef(database, DB_MESSAGES_KEY);
  const imgRef = storageRef(storage, DB_IMAGES_KEY);

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
    setIsEditing(messages.map(() => false)); //amount of "false" in array to be same as messages.length
  }, [messages]);

  const writeData = async () => {
    let url = "";
    if (file) {
      const newStorageRef = storageRef(
        storage,
        DB_IMAGES_KEY + "/" + file.name
      );
      await uploadBytes(newStorageRef, file);
      url = await getDownloadURL(newStorageRef);
    }
    set(push(messagesRef), {
      timestamp: `${new Date()}`,
      edited: "",
      message: inputValue,
      URL: url,
    });
  };

  const deleteAll = () => remove(messagesRef);

  const editData = (data, i) => {
    setEditValue(data?.val?.message);
    setIsEditing((prev) => prev.map((bool, j) => (i === j ? !bool : bool)));
    if (isEditing[i]) {
      update(databaseRef(database, DB_MESSAGES_KEY + "/" + data.key), {
        edited: `${new Date()}`,
        message: editValue,
      });
      setEditValue("");
    }
  };

  const deleteData = (data) =>
    remove(databaseRef(database, DB_MESSAGES_KEY + "/" + data.key));

  // Convert messages in state to message JSX elements to render
  const messageListItems = messages.map((message, index) => {
    return (
      <li key={message.key}>
        {isEditing[index] ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
          />
        ) : (
          <div className="text-messages">{message.val.message}</div>
        )}
        <div className="edit-delete">
          <button onClick={() => editData(message, index)}>Edit</button>
          <button onClick={() => deleteData(message)}>Delete</button>
        </div>
        <div>
          {message?.val?.URL && (
            <img src={message.val.URL} alt="image" width="100px" />
          )}
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
          <input type="text" onChange={(e) => setInputValue(e.target.value)} />
          <button disabled={!inputValue} onClick={() => writeData()}>
            Send
          </button>
          <button disabled={messages.length === 0} onClick={() => deleteAll()}>
            NUKE
          </button>
          <br />
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </form>
        <ul className="message-box">{messageListItems}</ul>
      </div>
    </>
  );
}
