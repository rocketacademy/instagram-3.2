import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";

export default function AuthForm({ isLoggedIn, email, setEmail, setUid }) {
  //Login
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  //error
  const [errorMsg, setErrorMsg] = useState("");

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
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setErrorMsg("");
      setUid("");
      setEmail("");
    } catch (error) {
      setErrorMsg(error.message);
    }
  };
  return (
    <>
      {!isLoggedIn ? (
        <>
          <p>
            <label htmlFor="email">E-mail: </label>
            <input
              id="email"
              type="email"
              autoComplete="on"
              pattern=".+@example\.com"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
            />
          </p>
          <p>
            <label htmlFor="password">Password: </label>
            <input
              id="password"
              type="password"
              autoComplete="on"
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
    </>
  );
}
