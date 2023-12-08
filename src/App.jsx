import "./App.css";
import { onChildAdded, push, ref, set, remove } from "firebase/database";
import { database } from "./firebase";
import { useState, useEffect } from "react";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
const currentDate = new Date().toString();

function App() {
  const [messages, setMessages] = useState([]);
  const [inputTextValue, setInputTextValue] = useState("");

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

  const writeData = (e) => {
    e.preventDefault();
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      Comment: inputTextValue,
      Timestamp: currentDate,
    });
    setInputTextValue("");
  };

  const deleteMessage = (messageKey) => {
    const updatedMessageList = messages.filter((message) => message.key !== messageKey);
    setMessages(updatedMessageList);
    remove(ref(database, `${DB_MESSAGES_KEY}/${messageKey}`));
  };
  // Convert messages in state to message JSX elements to render
  // let messageListItems = messages.reverse().map((message) => (
  //   <li key={message.key}>
  //     {message.val.Timestamp}-{message.val.Comment}
  //   </li>
  // ));

  return (
    <>
      <div className="bg-gradient-to-b from-cyan-300 to-white-100 shadow-2xl dark:bg-grey-400 px-3 py-2 rounded-lg ">
        <h1 className="text-2xl font-bold text-rose-500">Rocketgram</h1>
        <div className="card ">
          <form onSubmit={writeData}>
            <input
              className="w-half border bg-teal-100 border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline none focus:border-indigo-500"
              type="text"
              value={inputTextValue}
              onChange={(e) => setInputTextValue(e.target.value)}
            />
            <br /> <br />
            <input className="bg-cyan-300 hover:bg-cyan-600 rounded-lg px-4 py-1 " type="submit" value="Submit" />
          </form>
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="flex-1">
            <h2 className="p-2 text-lg">Time & Date</h2>
            <ul>
              {messages.reverse().map((message) => (
                <li className="p-2 flex" key={message.key}>
                  {message.val.Timestamp}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1">
            <h2 className="p-2 text-lg">Chats</h2>
            <ul>
              {messages.map((message) => (
                <li className="p-2 flex justify-center items-center" key={message.key}>
                  <span className="flex-1">{message.val.Comment}</span>
                  <button
                    className="ml-auto rounded-lg outline outline-offset-2 outline-blue-300"
                    onClick={() => {
                      deleteMessage(message.key);
                    }}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
