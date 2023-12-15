import { useState } from "react";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function LoginSignup(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        props.setIsLoggedIn(true);
        props.setUser(userCredential.user);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <label>Email</label>
      <br />
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Insert your valid email here."
      />
      <br />
      <label>Password</label>
      <br />
      <input
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Insert your password here."
      />
      <br />
      <button onClick={signup}> Sign Up</button>
    </div>
  );
}
