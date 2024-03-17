import logo from "/logo.png";
import "./App.css";
import { onChildAdded, push, ref, set } from "firebase/database";
import { database } from "./firebase";
import { useState, useEffect } from "react";
import { Instafeed } from "./InstaFeed";
import { InstaPost } from "./InstaPost";
import { SideBar } from "./SideBar";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";

function App() {
  const [messages, setMessages] = useState<any[]>([]);
  const [view, setView] = useState<string | null | void>("post");

  const toggleView = (newView: string) => {
    setView((prevView) => setView(newView));
  };

  useEffect(() => {
    const messagesRef = ref(database, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      setMessages((prevState) =>
        // Store message key so we can use it as a key in our list items when rendering messages
        [...prevState, { key: data.key, val: data.val() }]
      );
    });
  }, []);

  // Convert messages in state to message JSX elements to render
  let messageListItems = messages.map((message) => (
    <li key={message.key}>{message.val}</li>
  ));

  return (
    <div className="grid grid-cols-4 h-svh">
      {/* Side bar (child) can change the view of the parent component */}
      <SideBar toggleView={toggleView} />
      {view === "post" ? <InstaPost /> : <Instafeed />}
    </div>
  );
}

export default App;
