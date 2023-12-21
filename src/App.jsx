import { useState } from "react";
import Composer from "./Composer";
import NewsFeed from "./NewsFeed";
import AuthForm from "./AuthForm";
import logo from "/logo.png";
import "./App.css";

export default function App() {
  //check login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //user info
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");

  return (
    <>
      <div>
        <img src={logo} className="logo" alt="Rocket logo" />
      </div>
      <h1>Rocketgram</h1>
      <AuthForm
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        email={email}
        setEmail={setEmail}
        setUid={setUid}
      />
      {isLoggedIn && <Composer uid={uid} email={email} />}
      <div className="card">
        <ul
          className="message-box"
          style={{ borderBottom: "1px dotted white" }}>
          <NewsFeed isLoggedIn={isLoggedIn} uid={uid} />
        </ul>
      </div>
    </>
  );
}
