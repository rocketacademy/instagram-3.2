import React, { useEffect, useState } from "react";
import {
  onChildAdded,
  push,
  ref,
  set,
  update,
  remove,
} from "firebase/database";
import { database } from "./firebase";
import FirebaseDisplay from "./FirebaseDisplay";

const DB_MESSAGES_KEY = "messages";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesRef = ref(database, DB_MESSAGES_KEY);

  useEffect(() => {
    onChildAdded(messagesRef, (data) => {
      setMessages((previousData) => [
        ...previousData,
        { key: data.key, val: data.val() },
      ]);
    });
  }, []);

  const writeData = (e) => {
    e.preventDefault();
    const newMessageRef = push(messagesRef);
    const timestamp = new Date().toLocaleString();
    set(newMessageRef, { content: newMessage, timestamp });
    setNewMessage("");
  };

  const editMessage = (key, updatedContent) => {
    update(ref(database, `${DB_MESSAGES_KEY}/${key}`), {
      content: updatedContent,
    });
  };

  const deleteMessage = (key) => {
    remove(ref(database, `${DB_MESSAGES_KEY}/${key}`));
  };

  return (
    <div>
      <form onSubmit={writeData}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <input type="submit" value="Submit" />
      </form>

      {messages && messages.length > 0 ? (
        messages.map((message) => (
          <div key={message.key}>
            <p>{message.val.content}</p>
            <p>{message.val.timestamp}</p>
            <button
              onClick={() => {
                const updatedContent = prompt("Enter the updated message:");
                if (updatedContent) {
                  editMessage(message.key, updatedContent);
                }
              }}
            >
              Edit
            </button>
            <button onClick={() => deleteMessage(message.key)}>Delete</button>
          </div>
        ))
      ) : (
        <p>Messages</p>
      )}

      {/* <FirebaseDisplay
        chat={messages}
        startUpdate={startUpdate}
        deleteItem={deleteItem}
      /> */}
    </div>
  );
}
