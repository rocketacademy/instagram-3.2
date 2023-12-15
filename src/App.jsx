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

  const [liked, setLiked] = useState([]);

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
    setIsEditing(messages.map(() => false)); //amount of "false" in array to be same as messages.length
    setLiked(messages.map(() => false));
  }, [messages.length]);

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
      url: url,
      likeCount: 0,
    });
    setInputValue("");
    setFile(null);
  };

  const deleteAll = () => remove(messagesRef);

  const editData = (data, index) => {
    setEditValue(data?.val?.message);
    setIsEditing((prev) => prev.toSpliced(index, 1, !prev[index]));
    if (isEditing[index]) {
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
            style={{ width: "12.5em", marginRight: "2.3em" }}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
          />
        ) : (
          <div className="text-messages">{message.val.message}</div>
        )}

        {liked[index] ? (
          <button
            onClick={() => {
              setLiked((prev) => prev.toSpliced(index, 1, !prev[index]));
              // update(
              //   databaseRef(database, DB_MESSAGES_KEY + "/" + message.key),
              //   {
              //     likeCount: message.val.likeCount - 1,
              //   }
              // );
            }}>
            {message.val.likeCount}
            <svg
              className="with-icon_icon__MHUeb"
              data-testid="geist-icon"
              height="24"
              shapeRendering="geometricPrecision"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              width="24"
              style={{
                color: "var(--geist-foreground)",
                "--geist-fill": "currentColor",
                "--geist-stroke": "var(--geist-background)",
                width: "1em",
                height: "1em",
              }}>
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                fill="var(--geist-fill)"
              />
            </svg>
          </button>
        ) : (
          <button
            onClick={() => {
              setLiked((prev) => prev.toSpliced(index, 1, !prev[index]));
              update(
                databaseRef(database, DB_MESSAGES_KEY + "/" + message.key),
                {
                  likeCount: message.val.likeCount + 1,
                }
              );
            }}>
            {message.val.likeCount}
            <svg
              className="with-icon_icon__MHUeb"
              data-testid="geist-icon"
              fill="none"
              height="24"
              shapeRendering="geometricPrecision"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              width="24"
              style={{
                color: "var(--geist-foreground)",
                width: "1em",
                height: "1em",
              }}>
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                fill="var(--geist-fill)"
              />
            </svg>
          </button>
        )}

        <div className="edit-delete">
          <button onClick={() => editData(message, index)}>Edit</button>
          <button onClick={() => deleteData(message)}>Delete</button>
        </div>
        <div>
          {!!message?.val?.url && (
            <img
              src={message.val.url}
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
      <div className="card">
        {/* TODO: Add input field and add text input as messages in Firebase */}
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            style={{ width: "14.6em", marginRight: "1.4em" }}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
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
