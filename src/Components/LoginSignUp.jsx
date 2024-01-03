import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function LoginSignUp({setUser, setIsLoggedIn, isLoggedIn}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const signUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setIsLoggedIn(true);
        setUser(userCredential.user);
      })
      .catch((err) => {
        console.log(err);
      });
      navigate("/form")
  };

  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setIsLoggedIn(true);
        setUser(userCredential.user);
      })
      .catch((err) => {
        console.log(err);
      });
      navigate("/form");
  };

  return (
    <div className="login-page">
      {isLoggedIn? null : 
      <>
      <label>Email: </label>
      <input value={email} onChange={(e) => setEmail(e.target.value)}></input>
      <br />
      <label>Password: </label>
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      ></input>
      <div>
        <button onClick={signIn}>Sign In</button>
        <button onClick={signUp}>Sign Up</button>
      </div>
      </>}
    </div>
  );
}

export default LoginSignUp;
