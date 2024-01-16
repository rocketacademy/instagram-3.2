import { useState } from "react";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function LoginSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
      })
      .catch((err) => {
        console.log(err);
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
      />
      <br />
      <label>Password</label>
      <br />
      <input
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={signup}>Sign Up</button>
    </div>
  );
}
