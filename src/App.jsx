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
  deleteObject,
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
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
  //capture likes
  const [liked, setLiked] = useState([]);
  //check login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //Login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const messagesRef = databaseRef(database, DB_MESSAGES_KEY);

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
    //amount of "false" in array to be same as messages.length
    const arrayFillFalse = [...Array(messages.length)].fill(false);
    setIsEditing(arrayFillFalse);
    setLiked(messages.map((message) => message.val.like));
  }, [messages.length]);

  const writeData = async () => {
    let name = "";
    let url = "";
    if (file) {
      const newStorageRef = storageRef(
        storage,
        DB_IMAGES_KEY + "/" + file.name
      );
      await uploadBytes(newStorageRef, file);
      url = await getDownloadURL(newStorageRef);
      name = file.name;
    }
    set(push(messagesRef), {
      timestamp: `${new Date()}`,
      edited: "",
      message: inputValue,
      fileName: name,
      fileUrl: url,
      likeCount: 0,
      like: false,
    });
    setInputValue("");
    setFile(null);
  };

  const deleteAll = async () => {
    // await deleteObject(storageRef(storage, DB_IMAGES_KEY + "/"));
    remove(messagesRef);
  };

  const editData = (data, index) => {
    setEditValue(data?.val?.message);
    setIsEditing((prev) => prev.with(index, !prev[index]));
    if (isEditing[index]) {
      update(databaseRef(database, DB_MESSAGES_KEY + "/" + data.key), {
        edited: `${new Date()}`,
        message: editValue,
      });
      setEditValue("");
    }
  };

  const deleteData = async (data) => {
    if (data.val.fileName) {
      await deleteObject(
        storageRef(storage, DB_IMAGES_KEY + "/" + data.val.fileName)
      );
    }
    remove(databaseRef(database, DB_MESSAGES_KEY + "/" + data.key));
  };

  const likeUnlike = (data, index) => {
    if (liked[index]) {
      setLiked((prev) => prev.with(index, !prev[index]));
      update(databaseRef(database, DB_MESSAGES_KEY + "/" + data.key), {
        likeCount: data.val.likeCount - 1,
        like: false,
      });
    } else {
      setLiked((prev) => prev.with(index, !prev[index]));
      update(databaseRef(database, DB_MESSAGES_KEY + "/" + data.key), {
        likeCount: data.val.likeCount + 1,
        like: true,
      });
    }
  };

  const signUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCredential);
    } catch (error) {
      console.log(error);
    }
  };

  const logIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setIsLoggedIn(!isLoggedIn);
      console.log(userCredential);
    } catch (error) {
      console.log(error);
    }
  };

  // Convert messages in state to message JSX elements to render
  const messageListItems = messages.map((message, index) => {
    return (
      <li
        key={message.key}
        style={{
          borderTop: "1px dotted white",
        }}>
        {/* input if editing, else just show message */}
        {isEditing[index] ? (
          <input
            style={{ width: "12.5em", marginRight: "2.3em" }}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
          />
        ) : (
          <div className="text-messages">{message.val.message}</div>
        )}
        <div className="buttons">
          {/* like button that toggles */}
          {liked[index] ? (
            <button onClick={() => likeUnlike(message, index)}>
              {message.val.likeCount}
              <iconify-icon
                icon="fa6-solid:heart"
                style={{ color: "red" }}></iconify-icon>
            </button>
          ) : (
            <button onClick={() => likeUnlike(message, index)}>
              {message.val.likeCount}
              <iconify-icon
                icon="fa6-regular:heart"
                style={{ color: "red" }}></iconify-icon>
            </button>
          )}

          {/* edit button that also submits edit value, other edit buttons are disabled while editing */}
          <button
            disabled={
              isEditing.some((bool) => bool === true)
                ? !isEditing[index]
                : isEditing[index]
            }
            onClick={() => editData(message, index)}>
            Edit
          </button>
          <button onClick={() => deleteData(message)}>Delete</button>
        </div>
        {/* display image if it exist */}
        <div>
          {!!message?.val?.fileUrl && (
            <img
              src={message.val.fileUrl}
              alt="image"
              style={{ maxWidth: "150px", maxHeight: "150px" }}
            />
          )}
        </div>
        <div className="info">
          <span style={{ paddingRight: "1.325em" }}>Sent: </span>
          {new Date(message.val.timestamp).toLocaleString()}
          {!!message?.val?.edited && (
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
      <h1>Rocketgram</h1>
      <div className="login">
        E-mail:{" "}
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        Password:{" "}
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />{" "}
        <br />
        <button onClick={signUp}>Sign Up</button>
        {!isLoggedIn ? (
          <button onClick={logIn}>Log In</button>
        ) : (
          <button onClick={() => setIsLoggedIn(!isLoggedIn)}>Log Out</button>
        )}
      </div>
      <div className="card">
        {/* TODO: Add input field and add text input as messages in Firebase */}
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            style={{ width: "14.6em", marginRight: "1.4em" }}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button disabled={!inputValue} onClick={writeData}>
            Send
          </button>
          <button disabled={messages.length === 0} onClick={deleteAll}>
            NUKE
          </button>
          <br />
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </form>
        <ul
          className="message-box"
          style={{ borderBottom: "1px dotted white" }}>
          {messageListItems}
        </ul>
      </div>
    </>
  );
}
