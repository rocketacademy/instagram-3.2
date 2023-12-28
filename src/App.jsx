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
import { database, storage } from "./firebase.jsx";
import { useState, useEffect } from "react";
import MessageList from "./MessageList.jsx";
import AuthForm from "./AuthForm.jsx";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import MessageInput from "./MessageInput.jsx";
import Navbar from "./NavBar.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Authentication from "./Authentication.jsx";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const handleUserSignIn = (email) => {
    setUserEmail(email);
  };

  // Authentication
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(user); // Consider if this should be set to 'true'
        setUserEmail(user.email); // Set userEmail upon authentication
        console.log("user logged in.");
        return;
      }
      setIsLoggedIn(null); // Set isLoggedIn when user is not authenticated
      setUserEmail(null); // Clear userEmail when user is not authenticated
    });
  }, []);

  const handleSignOut = () => {
    auth.signOut().then(() => {
      // Sign-out successful.
      setIsLoggedIn(false); // Update isLoggedIn state or perform any other necessary actions
      console.log("User signed out successfully");
    });
  };

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

  //router

  const RequireAuth = ({ userEmail }) => {
    useEffect(() => {
      console.log("Authenticate User Email:", userEmail);
    }, [userEmail]);

    const isAuthenticated = userEmail ? true : false;
    return isAuthenticated && isLoggedIn ? (
      <div>
        <Authentication
          isLoggedIn={isLoggedIn}
          handleSignOut={handleSignOut}
          setIsLoggedIn={setIsLoggedIn}
        />
        <MessageInput
          writeData={writeData}
          handleInputChange={handleInputChange}
          handleImages={handleImages}
          userInput={userInput}
          fileInputValue={fileInputValue}
        />
        <MessageList
          messages={messages}
          editMessage={editMessage}
          removeMessage={removeMessage}
          isLoggedIn={isLoggedIn}
        />
      </div>
    ) : (
      <div>
        <Authentication isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div>
          <Navbar />
          <AuthForm onUserSignIn={handleUserSignIn} />
        </div>
      ),
    },
    {
      path: "/newsfeed",
      element: (
        <div>
          <Navbar />
          <RequireAuth isLoggedIn={isLoggedIn} userEmail={userEmail} />
        </div>
      ),
    },
  ]);

  return (
    <RouterProvider router={router}>
      <router />
    </RouterProvider>
  );
}

export default App;
