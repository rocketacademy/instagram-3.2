import { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function LoginSignup(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        props.setIsLoggedIn(true);
        props.setUser(userCredential.user);
        console.log(userCredential);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const signup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        props.setIsLoggedIn(true);
        props.setUser(userCredential.user);
        console.log(userCredential);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <label> Email </label>
      <br />
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Insert email here"
      ></input>
      <br />
      <label> Password </label>
      <br />
      <input
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Insert password here"
      ></input>
      <br />
      <button onClick={signup}>Sign up</button>
      <button onClick={signin}>Sign in</button>
    </div>
  );
}
