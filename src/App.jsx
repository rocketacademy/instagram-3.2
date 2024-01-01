import logo from "/logo.png";
import "./App.css";
import {
  onChildAdded,
  push,
  ref as databaseRef,
  set,
  onChildChanged,
} from "firebase/database";

import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

//React components
import Composer from "./Components/Composer";
import Newsfeed from "./Components/Newsfeed";

import { database, storage } from "./firebase";

import LoginSignup from "./Components/LoginSignup";

import { useState, useEffect } from "react";
import FirebaseDisplay from "./FirebaseDisplay";

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

  const [like_count, setLikeCount] = useState(0);

  const [user, setUser] = useState({});

  useEffect(() => {
    const messagesRef = databaseRef(database, DB_MESSAGES_KEY);

    onChildAdded(messagesRef, (data) => {
      //console.log("data.val() : ", data.val());
      //console.log("data.key: ", data.key);

      //HELP
      const ifKeyExistsInArray = (element) => element.key === data.key;

      setMessages((prevMessages) => {
        if (prevMessages.some(ifKeyExistsInArray)) {
          return prevMessages;
        } else {
          return [...prevMessages, { key: data.key, val: data.val() }];
          //data.val() is used to retrieve the value associated with the node/reference in the database.
        }
      });
    });

    onChildChanged(messagesRef, (data) => {
      //console.log("data: ", data);

      //console.log("key of data being changed", data.key);

      const ifKeyExistsInArray = (element) => element.key === data.key;

      setMessages((prevMessages) => {
        // Check if the message with the same key exists in the previous messages
        const messageIndex = prevMessages.findIndex(
          (message) => message.key === data.key
          //Looking for an element in the array of prevMessages that matches the condition
          //that we provided in the callback function (in other words, that message.key === data.key)
        );

        if (messageIndex !== -1) {
          // If the message with the key already exists, update the like count
          const updatedMessages = [...prevMessages];

          //Take that specific message with the correct key and update it's val()
          updatedMessages[messageIndex] = {
            ...updatedMessages[messageIndex],
            val: data.val(),
          };
          return updatedMessages;
        } else {
          // If the message with the key doesn't exist, add it to the messages
          return [...prevMessages, { key: data.key, val: data.val() }];
        }
      });
    });
  }, []);

  const writeData = (e) => {
    e.preventDefault();
    //Stops the default behavior of the form refreshing after submission.
    const messageListRef = databaseRef(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);

    const storageRefInstance = storageRef(
      storage,
      DB_STORAGE_KEY + fileInputFile.name
    );

    uploadBytes(storageRefInstance, fileInputFile).then((v) => {
      //console.log(v);
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
          user: user.email,
          like_count: like_count,
        });
      });
    });
    setMessageUserInput("");
    setFileInputValue("");
  };

  return (
    <>
      <div>
        <img src={logo} className="logo" alt="Rocket logo" />
      </div>
      <h1>Instagram Bootcamp</h1>

      {/* Passing in the setUser function so we can update our user*/}
      <LoginSignup setUser={setUser} setIsLoggedIn={setIsLoggedIn} />

      {isLoggedIn ? (
        <>
          <p>Thank you for logging in!</p>
          <Composer
            messageUserInput={messageUserInput}
            setMessageUserInput={setMessageUserInput}
            fileInputValue={fileInputValue}
            setFileInputValue={setFileInputValue}
            fileInputFile={fileInputFile}
            setFileInputFile={setFileInputFile}
            writeData={writeData}
          />
        </>
      ) : (
        <p>Log in to make a post!</p>
      )}

      {
        //console.log(user)
      }
      <FirebaseDisplay />
      {isLoggedIn ? <p>Welcome {user.email}!</p> : <p>Welcome!</p>}
      <Newsfeed messages={messages} DB_MESSAGES_KEY={DB_MESSAGES_KEY} />
    </>
  );
}

export default App;
