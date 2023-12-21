import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Composer from "./Composer";
import NewsFeed from "./NewsFeed";
import AuthForm from "./AuthForm";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import logo from "/logo.png";
import "./App.css";
import NavBar from "./NavBar";

export default function App() {
  //check login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //user info
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setEmail(auth.currentUser.email);
        setUid(auth.currentUser.uid);
      } else setIsLoggedIn(false);
    });
  }, []); // eslint-disable-line

  const router = createBrowserRouter([
    {
      path: "/instagram-3.2/",
      element: (
        <>
          <NavBar />
          <AuthForm
            isLoggedIn={isLoggedIn}
            email={email}
            setEmail={setEmail}
            setUid={setUid}
          />
        </>
      ),
    },
    {
      path: "/instagram-3.2/NewsFeed",
      element: (
        <>
          <NavBar />
          {isLoggedIn && <Composer uid={uid} email={email} />}
          <div className="card">
            <ul
              className="message-box"
              style={{ borderBottom: "1px dotted white" }}>
              <NewsFeed isLoggedIn={isLoggedIn} uid={uid} />
            </ul>
          </div>
        </>
      ),
    },
  ]);

  return (
    <>
      <div>
        <img src={logo} className="logo" alt="Rocket logo" />
      </div>
      <h1>Rocketgram</h1>
      <RouterProvider router={router} />
    </>
  );
}
