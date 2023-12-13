import logo from "/logo.png";
import "./App.css";
import { onChildAdded, push, ref, set } from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { database, storage } from "./firebase";
import { useState, useEffect } from "react";
import LoginSignup from "./Components/LoginSignup";
import FirebaseForm from "./Components/FirebaseForm";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
//save image key
const STORAGE_KEY = "images/";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  const handleSignOut = () => {
    signOut(auth).then(() => {
      setIsLoggedIn(false);
      setUser({});
    });
  };

  return (
    <>
      <div>
        <img src={logo} className="logo" alt="Rocket logo" />
      </div>
      <h1>Instagram Bootcamp</h1>
      {isLoggedIn ? (
        <button onClick={handleSignOut}>Sign out</button>
      ) : (
        <LoginSignup setUser={setUser} setIsLoggedIn={setIsLoggedIn} />
      )}
      <div className="card">
        <FirebaseForm isLoggedIn={isLoggedIn} user={user} />
      </div>
    </>
  );
}

export default App;
