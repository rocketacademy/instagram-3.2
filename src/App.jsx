import logo from "/logo.png";
import "./App.css";
import { onChildAdded, push, ref as databaseRef, set } from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
//storageref will allow us to grab a particular location inside the filesystem in firebase
//uploadBytes will allow us to take a file and put it online

import { database, storage } from "./firebase";

import LoginSignup from "./LoginSignup";

import { useState, useEffect } from "react";
import FirebaseDisplay from "./FirebaseDisplay";
//console.log(firebaseConfig);
// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
const DB_STORAGE_KEY = "images";
//-> names of the location that we will eventually store the file/message in, in our database/storage

function App() {
  //states for firebase database
  const [messages, setMessages] = useState([]);
  const [messageUserInput, setMessageUserInput] = useState("");

  //States for firebase storage (to capture storage files)
  const [fileInputFile, setFileInputFile] = useState(null);
  const [fileInputValue, setFileInputValue] = useState("");

  //States for firebase auth.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //isLoggedIn lets us check if the user is logged in or not
  const [user, setUser] = useState({});
  //have a user object -> lets us customise pages to different people?

  useEffect(() => {
    const messagesRef = databaseRef(database, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    // onChildAdded is like an event listener and now that it's been called it will keep listening out for any children added to the specific database reference passed in
    onChildAdded(messagesRef, (data) => {
      console.log("data.val() : ", data.val());
      console.log("data.key: ", data.key);
      //ask babe to explain this tmr
      const ifKeyExistsInArray = (element) => element.key === data.key;
      //data is the data of the child that is added
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      setMessages(
        (prevState) => {
          if (prevState.some(ifKeyExistsInArray)) {
            return prevState;
          } else {
            return [...prevState, { key: data.key, val: data.val() }];
          }
        }
        // Store message key so we can use it as a key in our list items when rendering messages

        //{ key: data.key, val: data.val()} -> extracting the data that we need from Firebase and using it to add to this array of messages.
        //data.key represents the unique key of the Firebase child element
      );
    });
  }, []);

  const writeData = (e) => {
    e.preventDefault();
    //Stops the default behavior of the form refreshing after submission.
    const messageListRef = databaseRef(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    //set takes in a reference
    const storageRefInstance = storageRef(
      storage,
      DB_STORAGE_KEY + fileInputFile.name
    );
    // the fileInputFile will have a name that is something like: sexy.jpg
    // that, + the DB_STORAGE_KEY, will make something like "image/sexy.jpg"

    uploadBytes(
      //44 min video url : day17 zoom
      storageRefInstance,
      fileInputFile
    ).then((v) => {
      //callback function in the then will only run after the promise is resolved.
      //if i don't pass a function in (and pass a function call,) it will just try to evaluate the entire thing immediately.
      //which means that the code in the then will prematurely run
      console.log(v);
      getDownloadURL(storageRefInstance).then((url) => {
        const dateobject = new Date();
        var time_in_minutes = "";

        if (dateobject.getMinutes < 10) {
          time_in_minutes = "0" + dateobject.getMinutes();
        } else {
          time_in_minutes = dateobject.getMinutes();
        }

        var current_date =
          dateobject.getHours() +
          ":" +
          time_in_minutes +
          "        " +
          dateobject.getDay() +
          "/" +
          (dateobject.getMonth() + 1) +
          "/" +
          dateobject.getFullYear();

        //Once we get our url back from the storage, we send it off to the database)
        set(newMessageRef, {
          date: current_date,
          textSent: messageUserInput,
          url: url,
        });
      });
    });

    //Get the time of the message being sent:

    //
    setMessageUserInput("");
    setFileInputValue("");
  };
  // message.val.date
  // Convert messages in state to message JSX elements to render
  let messageListItems = messages.map((message) => (
    <div className="message-box" key={message.key}>
      <p>{message.val.textSent}</p>
      <p>Time Sent: {message.val.date}</p>
      <img src={message.val.url} />
    </div>
  ));

  return (
    <>
      <div>
        <img src={logo} className="logo" alt="Rocket logo" />
      </div>
      <h1>Instagram Bootcamp</h1>

      {/* Passing in the setUser function so we can update our user*/}
      <LoginSignup setUser={setUser} setIsLoggedIn={setIsLoggedIn} />

      <div className="card">
        {/* TODO: Add input field and add text input as messages in Firebase */}
        <form>
          <label htmlFor="message-input-box">Message: </label>
          <input
            id="message-input-box"
            type="text"
            value={messageUserInput}
            onChange={(e) => setMessageUserInput(e.target.value)}
          />
          <br />
          <label htmlFor="file-input-box">File Input: </label>
          <input
            id="file-input-box"
            type="file"
            value={fileInputValue}
            onChange={(e) => {
              setFileInputFile(e.target.files[0]);
              console.log("e.target.value is: ", e.target.value);
              setFileInputValue(e.target.value);
              console.log("file input value is: ", fileInputValue);
              console.log("file input file is : ", fileInputFile);
            }}
          />
          <br />
          <button onClick={writeData}>Send</button>
        </form>

        {isLoggedIn ? (
          <FirebaseDisplay />
        ) : (
          <p>You can't see the secret text.</p>
        )}

        {messageListItems}
      </div>
    </>
  );
}

export default App;
