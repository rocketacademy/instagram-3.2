import logo from "/logo.png";
import "./App.css";
import { useState, useEffect } from "react";
import AuthForm from "./Components/AuthForm";
import Composer from "./Components/Composer";
import NewsFeed from "./Components/NewsFeed";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Link,
  Route,
  RouterProvider,
  Outlet,
} from "react-router-dom";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

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
  const authForm = <AuthForm />;
  const createAccountOrSignInButton = (
    <div>
      <Link to="authform">Create Account Or Sign In</Link>
      <br />
    </div>
  );
  const composerAndNewsFeed = (
    <div>
      {/* Render composer if user logged in, else render auth button */}
      <Outlet />
      {loggedInUser ? composer : createAccountOrSignInButton}
      <br />
      <NewsFeed />
    </div>
  );

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={composerAndNewsFeed}>
        <Route path="authform" element={authForm} />
      </Route>
    )
  );

  return (
    <>
      <div className="bg-muted">
        <img src={logo} className="logo" alt="Rocket logo" />
      </div>
      <div className="card">
        <RouterProvider router={router} />
      </div>
    </>
  );
}

export default App;
