import logo from "/logo.png";
import { onChildAdded, onChildChanged, push, ref, set, update, remove, onChildRemoved } from "firebase/database";
import {ref as storageRef, uploadBytes, getDownloadURL} from 'firebase/storage'
import { db, storage } from "./firebase";
import { useState, useEffect, useLayoutEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import "./App.css";


// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
const DB_STORAGE_KEY = "images"

function App() {
  //captures full messages
  const [messages, setMessages] = useState([]);
  //captures text content
  const [textInputValue, setTextInputValue] = useState("");
  //captures storage files
  const [fileInputFile, setFileInputFile] = useState(null);
  // const [fileInputValue, setFileInputValue] = useState("")

  const messageListRef = ref(db, DB_MESSAGES_KEY);

  //editing
  const [editing, setEditing] = useState(false);
  const [editingData, setEditingData] = useState({})
  const messagesRef = ref(db, DB_MESSAGES_KEY);
  

  //for writing data
  useEffect(() => {
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      setMessages((prevState) =>
        // Store message key so we can use it as a key in our list items when rendering messages
        [...prevState, { key: data.key, val: data.val() }]
      );
    });
    onChildRemoved(messagesRef, (data) =>{
      setMessages((prev) => prev.filter((item) => item.key !== data.key))
    })
    console.log(document.querySelector(".messages-container").scrollHeight);
   
  }, []);

  //for edit
  useEffect(()=>{
    onChildChanged(messagesRef, (data) =>{
      const messageArr = [...messages];
      let isIndex = (element) => element.key == data.key;
      const index = messageArr.findIndex(isIndex);
      messageArr[index] = {key:data.key, val:data.val()};
      setMessages(messageArr)
    })
  },[editing])

  
  //for scroller to stay at the bottom, where i have created an anchor
  useLayoutEffect(()=>{
    document
    .querySelector(".messages-container")
    .scrollTo(0, document.querySelector(".messages-container").scrollHeight);
  })
  
  const writeData = (e) => {
    if (textInputValue!=""){
      e.preventDefault()

      const newMessageRef = push(messageListRef);
      if(fileInputFile){
      const storageRefInstance = storageRef(
        storage,
        DB_STORAGE_KEY + fileInputFile.name
      );
      
      uploadBytes(storageRefInstance, fileInputFile).then(()=>{
        getDownloadURL(storageRefInstance).then((url) => {
          
          set(newMessageRef, {
            textContent: textInputValue,
            url:url,
            time: new Date().toLocaleTimeString(navigator.language,{hour: "2-digit", minute:"2-digit"}),
          });
        })
      })}
      else{
        set(newMessageRef, {
          textContent: textInputValue,
          time: new Date().toLocaleTimeString(navigator.language, {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
      }
      
      setTextInputValue("");
      setFileInputFile(null)
    }
    };
    //kick off update
    const startUpdate = (message) =>{
      setEditing(true);
      setTextInputValue(message.val.textContent);
      setEditingData(message);
    }
  
    //for editing data
    const editData = (e) => {
      e.preventDefault();
      document.getElementById("")
      setEditing(false);
      const updates ={};
      updates[editingData.key]={
        textContent: textInputValue
      }
      update(messagesRef, updates);
      setTextInputValue("");
      setEditingData({});
    }

  //deleting
  const deleteMessage = (message) => {
    remove(ref(db, `${DB_MESSAGES_KEY}/${message.key}`))
  }


  // Convert messages in state to message JSX elements to render
  let messageListItems = messages.map((message) => (
    <li id={message.id} key={message.id}>
      <div className="message">
        <div className="pfp-container">
          <img src={logo} className="logo" alt="Rocket logo" />
        </div>
        <div className="message-content">
          <img className="message-image" src={message.val.url} alt={message.val.url} />
          <p>{message.val.textContent}</p>
        </div>
        <small className="message-time-stamp">{message.val.time}</small>
        <Dropdown>
          <Dropdown.Toggle
            variant="success"
            id="dropdownic-basic"
          ></Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => {
                startUpdate(message);
                document.getElementById("message-input").focus();
              }}
            >
              Edit
            </Dropdown.Item>
            <Dropdown.Item onClick={() => deleteMessage(message)}>
              Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </li>
  ));

  return (
    <div className="chat" data-bs-theme="dark">
      <h1 className="chatroom-header">Test Chat</h1>
      <div className="chat-container">
        <div className="messages-container">
          <ul className="message-list" style={{ listStyle: "none" }}>
            {messageListItems}
          </ul>
          <div className="messages-anchor"></div>
        </div>
        <form
          onSubmit={editing ? editData : writeData}
          className="text-message-input"
        >
          <input
            autoFocus={true}
            placeholder="Write message..."
            type="text"
            name=""
            id="message-input"
            value={textInputValue}
            onChange={(e) => setTextInputValue(e.target.value)}
            className="message-field"
          />
          <button
            style={
              fileInputFile != null
                ? { border: "1px solid green" }
                : { border: "none" }
            }
            type="button"
          >
            <label htmlFor="file-upload">
              <i className="fa-solid fa-image"></i>
            </label>{" "}
            <input
              type="file"
              id="file-upload"
              className="hidden-input"
              onChange={(e) => {
                setFileInputFile(e.target.files[0]);
              }}
            />
          </button>
          <button type="submit">
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
