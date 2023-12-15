import { useState } from "react";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function LoginSignUp({ setIsLoggedIn, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setIsLoggedIn(true);
        setUser(userCredential.user);
        console.log(userCredential);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const signup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setIsLoggedIn(true);
        setUser(userCredential.user);
        console.log(userCredential);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <label>Email:</label>
      <br />
      <input value={email} placeholder="Input email here" onChange={(e) => setEmail(e.target.value)} />
      <br />
      <label>Password:</label>
      <br />
      <input value={password} placeholder="Input password here" onChange={(e) => setPassword(e.target.value)} />
      <br />
      <button className="bg-green-200 p-1 m-3" onClick={signup}>
        Sign Up
      </button>

      <button className="bg-green-200 p-1 m-3" onClick={signin}>
        Sign In
      </button>
    </div>
  );
}
