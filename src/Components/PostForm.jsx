import React from 'react'
import {
  onChildAdded,
  onChildChanged,
  update,
  push,
  ref,
  set,
  remove,
  runTransaction,
  onChildRemoved,
} from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { database, storage } from "../firebase";
import { useState, useEffect } from "react";
import PostsDisplay from './PostsDisplay';

const DB_MESSAGES_KEY = "messages";
const DB_STORAGE_KEY = "images"; 

function PostForm({isLoggedIn, user}) {
  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [editing, setEditing] = useState(false);
  const [editingData, setEditingData] = useState({});
  const [fileInputFile, setFileInputFile] = useState(null);
  const [currentURL, setCurrentURL] = useState("");
  const [currentLikes, setCurrentLikes] = useState(0);
  const [currentDislikes, setCurrentDislikes] = useState(0);
  const messagesRef = ref(database, DB_MESSAGES_KEY);

  useEffect(() => {
    onChildAdded(messagesRef, (data) => {
      setMessages((prev) => [
        ...prev,
        { key: data.key, val: data.val() },
      ]);
    });
    onChildRemoved(messagesRef, (data) => {
      setMessages((prev) => prev.filter((item) => item.key !== data.key))
    });
    onChildChanged (messagesRef, (data) => 
      setMessages((prev) => prev.map((item) => item.key === data.key ? { key: data.key, val: data.val() }: item
      ))
    );
  }, []);

  const writeData = (e) => {
    e.preventDefault();
    const newMessageRef = push(messagesRef);
    const storageRefInstance = storageRef(
      storage,
      DB_STORAGE_KEY + "/" + fileInputFile.name
    );
    try {
      uploadBytes(storageRefInstance, fileInputFile).then(() => {
        getDownloadURL(storageRefInstance).then((url) => {
          console.log(url);
          set(newMessageRef, {
            text: textInput,
            name: nameInput,
            timeStamp: new Date().toLocaleString(),
            url: url,
            likes: 0,
            dislikes: 0,
          });
        });
      });
    } catch (err) {
      console.log(err);
    }
  };

  const editData = (e) => {
    e.preventDefault();
    setEditing(false);

    const updates = {};
    updates[editingData.key] = {
      text: textInput,
      name: nameInput,
      timeStamp: new Date().toLocaleString(),
      url: currentURL,
      likes: currentLikes,
      dislikes: currentDislikes,
    };

    update(messagesRef, updates);
    setTextInput("");
    setEditingData({});
    setNameInput("");
  };

  const startUpdate = (message) => {
    setEditing(true);
    setTextInput(message.val.text);
    setNameInput(message.val.name);
    setCurrentURL(message.val.url);
    setCurrentLikes(message.val.likes);
    setCurrentDislikes(message.val.dislikes);
    setEditingData(message);
  };

  const deleteMessage = (messageKey) => {
    remove(ref(database, `${DB_MESSAGES_KEY}/${messageKey}`));
  };

  const addLike = (message) => {
    const messageRef = ref(database, DB_MESSAGES_KEY + "/" + message.key);

    runTransaction(messageRef, (currentData) => {
      if (currentData) {
        currentData.likes = (currentData.likes || 0) + 1;
      }
      return currentData;
    });
  };

  const addDislikes = (message) => {
    const messageRef = ref(database, DB_MESSAGES_KEY + "/" + message.key);

    runTransaction(messageRef, (currentData) => {
      if (currentData) {
        currentData.dislikes = (currentData.dislikes || 0) + 1;
      }
      return currentData;
    });
  };

  return (
    <div>
      {user == {} ? null : <p> Welcome back! {user.email} </p> }
      {isLoggedIn? 
      <form
        onSubmit={editing ? editData : writeData}
        className="form-container"
      >
        <div className="left-align">
          <label>Post: </label>
          <input
            type="textarea"
            style={{ width: "15rem", height: "2rem" }}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
        </div>
        <div className="left-align">
          <label>Name: </label>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
        </div>
        <div className="left-align">
          <label>Picture: </label>
          <input
            type="file"
            onChange={(e) => setFileInputFile(e.target.files[0])}
          />
        </div>
        <input type="submit" value="submit" className="left-align" />
      </form> : null}

      <div className="left-align">
        <h4>Post Thread: </h4>
        <PostsDisplay
          messages={messages}
          startUpdate={startUpdate}
          deleteMessage={deleteMessage}
          addLike={addLike}
          addDislikes={addDislikes}
          isLoggedIn={isLoggedIn}
        />
      </div> 
      </div> 
  );
}

export default PostForm