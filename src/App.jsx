import logo from "/logo.png";
import "./App.css";
import LoginSignUp from "./Components/LoginSignUp";
import PostForm from "./Components/PostForm";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

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
          <LoginSignUp setUser={setUser} setIsLoggedIn={setIsLoggedIn}/>  
        )}
      <div className="card">
        <PostForm isLoggedIn={isLoggedIn} user={user}/> 
      </div>
    </>
  );
}

export default App;
