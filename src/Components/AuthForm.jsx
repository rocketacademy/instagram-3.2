import Button from "react-bootstrap/Button";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const [emailInputValue, setEmailInputValue] = useState("");
  const [passwordInputValue, setPasswordInputValue] = useState("");
  const [isNewUser, setIsNewUser] = useState(true);
  const [errorCode, setErrorCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const closeAuthForm = () => {
      // Reset auth form state
      setEmailInputValue("");
      setPasswordInputValue("");
      setIsNewUser(true);
      setErrorCode("");
      setErrorMessage("");
      // Navigate back to news feed
      navigate("/");
    };

    const setErrorState = (error) => {
      setErrorCode(error.code);
      setErrorMessage(error.message);
    };

    // Authenticate user on submit
    if (isNewUser) {
      createUserWithEmailAndPassword(auth, emailInputValue, passwordInputValue)
        .then(closeAuthForm)
        .catch(setErrorState);
    } else {
      signInWithEmailAndPassword(auth, emailInputValue, passwordInputValue)
        .then(closeAuthForm)
        .catch(setErrorState);
    }
  };

  const toggleNewOrReturningAuth = () => {
    setIsNewUser((prevState) => !prevState);
  };

  return (
    <div className="text-white">
      <p>{errorCode ? `Error code: ${errorCode}` : null}</p>
      <p>{errorMessage ? `Error message: ${errorMessage}` : null}</p>
      <p>Sign in with this form to post.</p>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Email: </span>
          <input
            type="email"
            name="emailInputValue"
            value={emailInputValue}
            onChange={(e) => setEmailInputValue(e.target.value)}
          />
        </label>
        <br />
        <label>
          <span>Password: </span>
          <input
            type="password"
            name="passwordInputValue"
            value={passwordInputValue}
            onChange={(e) => setPasswordInputValue(e.target.value)}
          />
        </label>
        <br />
        <input
          type="submit"
          value={isNewUser ? "Create Account" : "Sign In"}
          // Disable form submission if email or password are empty
          disabled={!emailInputValue || !passwordInputValue}
        />
        <br />
        <Button variant="link" onClick={toggleNewOrReturningAuth}>
          {isNewUser
            ? "If you have an account, click here to login"
            : "If you are a new user, click here to create account"}
        </Button>
      </form>
    </div>
  );
};

export default AuthForm;
