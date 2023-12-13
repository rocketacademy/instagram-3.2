import logo from "/logo.png";
import "./App.css";
import LoginSignUp from "./Components/LoginSignUp";
import PostForm from "./Components/PostForm";
import PostsDisplay from "./Components/PostsDisplay";
import Navbar from "./Components/Navbar";
import { useState, useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
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
import { database, auth } from "./firebase";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

const DB_MESSAGES_KEY = "messages";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [messages, setMessages] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editingData, setEditingData] = useState({});
  const [textInput, setTextInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [currentURL, setCurrentURL] = useState("");

  const messagesRef = ref(database, DB_MESSAGES_KEY);

  useEffect(() => {
    onChildAdded(messagesRef, (data) => {
      setMessages((prev) => [...prev, { key: data.key, val: data.val() }]);
    });
    onChildRemoved(messagesRef, (data) => {
      setMessages((prev) => prev.filter((item) => item.key !== data.key));
    });
    onChildChanged(messagesRef, (data) =>
      setMessages((prev) =>
        prev.map((item) =>
          item.key === data.key ? { key: data.key, val: data.val() } : item
        )
      )
    );
  }, []);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      setIsLoggedIn(false);
      setUser({});
    });
  };

  const startUpdate = (message) => {
    setEditing(true);
    setTextInput(message.val.text);
    setNameInput(message.val.name);
    setCurrentURL(message.val.url);
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

  const RequireAuth = ({ children, redirectTo, user }) => {
    const isAuthenticated = user.email ? true : false;
    return isAuthenticated ? children : <Navigate to={redirectTo} />;
  };
  
 const router = createBrowserRouter([
   {
     path: "/",
     element: (
       <div>
         <Navbar isLoggedIn={isLoggedIn} handleSignOut={handleSignOut} />
         <LoginSignUp setUser={setUser} setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn}/>
       </div>
     ),
   },
   {
     path: "/posts",
     element: (
       <div>
         <Navbar isLoggedIn={isLoggedIn} handleSignOut={handleSignOut} />
         <PostsDisplay
           messages={messages}
           isLoggedIn={isLoggedIn}
           startUpdate={startUpdate}
           deleteMessage={deleteMessage}
           addLike={addLike}
           addDislikes={addDislikes}
         />
       </div>
     ),
   },
   {
     path: "/form",
     element: (
       <>
         <Navbar isLoggedIn={isLoggedIn} handleSignOut={handleSignOut} />
         <RequireAuth redirectTo={"/"} user={user}>
           <PostForm
             isLoggedIn={isLoggedIn}
             editing={editing}
             setEditing={setEditing}
             editingData={editingData}
             setEditingData={setEditingData}
             user={user}
           />
         </RequireAuth>
       </>
     ),
   },
 ]);

  return (
    <>
      <div>
        <img src={logo} className="logo" alt="Rocket logo" />
      </div>
      <h1>Instagram Bootcamp</h1>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
