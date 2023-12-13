import React from 'react'
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { push, ref, set, update } from "firebase/database"; 
import { database, storage } from "../firebase";
import { useState, useEffect } from "react";

const DB_STORAGE_KEY = "images"; 
const DB_MESSAGES_KEY = "messages";

function PostForm({isLoggedIn, user, editing, setEditing, setEditingData, editingData}) {
  const [textInput, setTextInput] = useState("");
  const [fileInputFile, setFileInputFile] = useState(null);
  const [currentURL, setCurrentURL] = useState("");
  const [currentLikes, setCurrentLikes] = useState(0);
  const [currentDislikes, setCurrentDislikes] = useState(0);

  const messagesRef = ref(database, DB_MESSAGES_KEY);

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
            name: user.email,
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
      name: user.email,
      timeStamp: new Date().toLocaleString(),
      url: currentURL,
      likes: currentLikes,
      dislikes: currentDislikes,
    };

    update(messagesRef, updates);
    setTextInput("");
    setEditingData({});
  };

  return (
    <div>
      {user.email? <p> Welcome back! {user.email} </p>: null}
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
          <label>Picture: </label>
          <input
            type="file"
            onChange={(e) => setFileInputFile(e.target.files[0])}
          />
        </div>
        <input type="submit" value="submit" className="left-align" />
      </form> : null}
      </div> 
  );
}

export default PostForm