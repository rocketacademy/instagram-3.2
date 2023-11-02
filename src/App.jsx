import logo from "/logo.png";
import "./App.css";
import { useState, useEffect } from "react";
import AuthForm from "./Components/AuthForm";
import Composer from "./Components/Composer";
import NewsFeed from "./Components/NewsFeed";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [shouldRenderAuthForm, setShouldRenderAuthForm] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      // If user is logged in, save logged-in user to state
      if (user) {
        setLoggedInUser(user);
        return;
      }
      // Else set logged-in user in state to null
      setLoggedInUser(null);
    });
  });

  const toggleAuthForm = () => {
    setShouldRenderAuthForm((prevState) => !prevState);
  };

  const authForm = <AuthForm toggleAuthForm={toggleAuthForm} />;
  const composer = (
    <div>
      <button
        onClick={() =>
          signOut(auth).then(() => {
            console.log("signed out");
          })
        }
      >
        Logout
      </button>
      <Composer loggedInUser={loggedInUser} />
    </div>
  );
  const createAccountOrSignInButton = (
    <div>
      <button onClick={toggleAuthForm}>Create Account Or Sign In</button>
      <br />
    </div>
  );
  const composerAndNewsFeed = (
    <div>
      {/* Render composer if user logged in, else render auth button */}

      {loggedInUser ? composer : createAccountOrSignInButton}
      <br />
      <NewsFeed />
    </div>
  );

  return (
    <>
      <div className="bg-muted">
        <img src={logo} className="logo" alt="Rocket logo" />
      </div>
      <div className="card">
        {shouldRenderAuthForm ? authForm : composerAndNewsFeed}
      </div>
    </>
  );
}

export default App;
