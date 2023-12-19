import logo from "/logo.png";
import "./App.css";
import {
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  ref as databaseRef,
  remove,
  update,
} from "firebase/database";
import { deleteObject, ref as storageRef } from "firebase/storage";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useState, useEffect } from "react";
import { database, storage, auth } from "./firebase";
import Composer from "./Composer";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
const DB_IMAGES_KEY = "images";

export default function App() {
  const [messages, setMessages] = useState([]);
  //capture edit
  const [isEditing, setIsEditing] = useState([]);
  const [editValue, setEditValue] = useState("");
  //capture likes
  const [liked, setLiked] = useState([]);
  //check login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //Login
  const [emailValue, setEmailValue] = useState("123@123.com");
  const [passwordValue, setPasswordValue] = useState("123123");
  //error
  const [errorMsg, setErrorMsg] = useState("");

  //user info
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");

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
    setIsEditing([...Array(messages.length)].fill(false));
    setLiked(messages.map((message) => !!message.val.like[uid]));
  }, [messages.length, isLoggedIn]); // eslint-disable-line

  const likeUnlike = (data, index) => {
    if (liked[index]) {
      setLiked((prev) => prev.with(index, !prev[index]));
      update(databaseRef(database, DB_MESSAGES_KEY + "/" + data.key), {
        likeCount: data.val.likeCount - 1,
        like: { ...data.val.like, [uid]: false },
      });
    } else {
      setLiked((prev) => prev.with(index, !prev[index]));
      update(databaseRef(database, DB_MESSAGES_KEY + "/" + data.key), {
        likeCount: data.val.likeCount + 1,
        like: { ...data.val.like, [uid]: true },
      });
    }
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

  // Convert messages in state to message JSX elements to render
  const messageListItems = messages.map((message, index) => (
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
          <button
            disabled={!isLoggedIn}
            onClick={() => likeUnlike(message, index)}>
            {message.val.likeCount}
            <iconify-icon
              icon="fa6-solid:heart"
              style={{ color: "red" }}></iconify-icon>
          </button>
        ) : (
          <button
            disabled={!isLoggedIn}
            onClick={() => likeUnlike(message, index)}>
            {message.val.likeCount}
            <iconify-icon
              icon="fa6-regular:heart"
              style={{ color: "red" }}></iconify-icon>
          </button>
        )}

        {/* edit button that also submits edit value, other edit buttons are disabled while editing */}
        <button
          disabled={
            (isEditing.some((bool) => bool === true)
              ? !isEditing[index]
              : isEditing[index]) || message.val.poster !== uid
          }
          onClick={() => editData(message, index)}>
          Edit
        </button>
        <button
          disabled={message.val.poster !== uid}
          onClick={() => deleteData(message)}>
          Delete
        </button>
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
  ));

  const signUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailValue,
        passwordValue
      );
      console.log(userCredential);
      setErrorMsg("");
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const logIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailValue,
        passwordValue
      );
      console.log(userCredential);
      setErrorMsg("");
      setEmail(auth.currentUser.email);
      setUid(auth.currentUser.uid);
      setIsLoggedIn(!isLoggedIn);
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setErrorMsg("");
      setIsLoggedIn(!isLoggedIn);
      setUid("");
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <>
      <div>
        <img src={logo} className="logo" alt="Rocket logo" />
      </div>
      <h1>Rocketgram</h1>
      <div className="login-component">
        {!isLoggedIn ? (
          <>
            <p>
              <label htmlFor="email">E-mail: </label>
              <input
                type="email"
                pattern=".+@example\.com"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
              />
            </p>
            <p>
              <label htmlFor="password">Password: </label>
              <input
                type="password"
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
              />
            </p>
            <p>{errorMsg}</p>
            <button onClick={signUp}>Sign Up</button>
            <button onClick={logIn}>Login</button>
          </>
        ) : (
          <>
            <p>{errorMsg}</p>
            <p>Welcome: {email}</p>
            <button onClick={logOut}>Logout</button>
          </>
        )}
      </div>
      {isLoggedIn && (
        <Composer
          uid={uid}
          database={database}
          databaseRef={databaseRef}
          storage={storage}
          storageRef={storageRef}
        />
      )}
      <div className="card">
        {/* TODO: Add input field and add text input as messages in Firebase */}
        <ul
          className="message-box"
          style={{ borderBottom: "1px dotted white" }}>
          {messageListItems}
        </ul>
      </div>
    </>
  );
}
