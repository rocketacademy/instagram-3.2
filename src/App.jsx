import logo from "/logo.png";
import "./App.css";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useState } from "react";
import { auth } from "./firebase";
import Composer from "./Composer";
import NewsFeed from "./NewsFeed";

export default function App() {
  //check login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //Login
  const [emailValue, setEmailValue] = useState("123@123.com");
  const [passwordValue, setPasswordValue] = useState("123123");
  //error
  const [errorMsg, setErrorMsg] = useState("");

  //user info
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");

  const signUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailValue,
        passwordValue
      );
      console.log(userCredential);
      setErrorMsg("");
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const logIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailValue,
        passwordValue
      );
      console.log(userCredential);
      setErrorMsg("");
      setEmail(auth.currentUser.email);
      setUid(auth.currentUser.uid);
      setIsLoggedIn(!isLoggedIn);
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setErrorMsg("");
      setIsLoggedIn(!isLoggedIn);
      setUid("");
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <>
      <div>
        <img src={logo} className="logo" alt="Rocket logo" />
      </div>
      <h1>Rocketgram</h1>
      <div className="login-component">
        {!isLoggedIn ? (
          <>
            <p>
              <label htmlFor="email">E-mail: </label>
              <input
                type="email"
                pattern=".+@example\.com"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
              />
            </p>
            <p>
              <label htmlFor="password">Password: </label>
              <input
                type="password"
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
              />
            </p>
            <p>{errorMsg}</p>
            <button onClick={signUp}>Sign Up</button>
            <button onClick={logIn}>Login</button>
          </>
        ) : (
          <>
            <p>{errorMsg}</p>
            <p>Welcome: {email}</p>
            <button onClick={logOut}>Logout</button>
          </>
        )}
      </div>
      {isLoggedIn && <Composer uid={uid} />}
      <div className="card">
        {/* TODO: Add input field and add text input as messages in Firebase */}
        <ul
          className="message-box"
          style={{ borderBottom: "1px dotted white" }}>
          <NewsFeed isLoggedIn={isLoggedIn} uid={uid} />
        </ul>
      </div>
    </>
  );
}
