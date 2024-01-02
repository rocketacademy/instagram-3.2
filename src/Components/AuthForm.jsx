import { useState, useEffect } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const AuthForm = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
      props.setIsLoggedIn(true);
      props.setUser(userCredential.user);
    });
  };

  const signUp = () => {
    createUserWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        props.setIsLoggedIn(true);
        props.setUser(userCredential.user);
      }
    );
  };

  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        props.setIsLoggedIn(true);
        props.setUser(user);
        navigate("/form");
      }
    });
  }, []);

  return (
    <div>
      <label>Email</label>
      <br />
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email here"
      />
      <br />
      <input
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password here"
      />
      <br />

      <button onClick={signUp}>Sign Up</button>
      <button onClick={signIn}>Sign In</button>
    </div>
  );
};

export default AuthForm;
