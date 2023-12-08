import logo from "/logo.png";
import "./App.css";
import { onChildAdded, onChildChanged, update, push, ref, set, remove} from "firebase/database";
import { database } from "./firebase";
import { useState, useEffect } from "react";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";

function App() {
  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState("")
  const [nameInput, setNameInput] = useState("")
  const [editing, setEditing] = useState(false);
  const [editingData, setEditingData] = useState({});
  const messagesRef = ref(database, DB_MESSAGES_KEY);

  useEffect(() => {
    onChildAdded(messagesRef, (data) => {
      setMessages((prevState) =>
        [...prevState, { key: data.key, val: data.val() }]
      );
    });
  }, []);

  useEffect(() => {
    onChildChanged(messagesRef, (data) => {
      const messagesArray = [...messages];
      let isIndex = (element) => element.key == data.key;
      const index = messagesArray.findIndex(isIndex);
      messagesArray[index] = { key: data.key, val: data.val() };
      setMessages(messagesArray);
    });
  }, [editing]);

  const writeData = () => {
    const newMessageRef = push(messagesRef);
    set(newMessageRef, {
      text: textInput,
      name: nameInput,
      timeStamp: new Date().toLocaleString()
    });
  };

  const editData = (e) => {
     e.preventDefault();
    setEditing(false);

     const updates = {};
     updates[editingData.key] = {
       text: textInput,
       name: nameInput,
       timeStamp: new Date().toLocaleString()
     };

     update(messagesRef, updates);
     setTextInput("");
     setEditingData({});
     setNameInput("");
  }

  const startUpdate = (message) => {
    setEditing(true);
    setTextInput(message.val.text);
    setNameInput(message.val.name);
    setEditingData(message)
  }

  const deleteMessage = (messageKey) => {
    const updatedMessageList = messages.filter((message) => message.key !== messageKey)
    setMessages(updatedMessageList)
    remove(ref(database,`${DB_MESSAGES_KEY}/${messageKey}`))
  }

  const tdStyle = { border: "1px solid white", padding: "10px" };

  let messageListItems = (
    <table
      style={{borderCollapse: "collapse", width: "100%" }}
    >
      <thead>
        <tr>
          <th style={tdStyle}>Name</th>
          <th style={tdStyle}>Message</th>
          <th style={tdStyle}>Timestamp</th>
          <th style={tdStyle}>Edit</th>
          <th style={tdStyle}>Delete</th>
        </tr>
      </thead>
      <tbody>
        {messages.map((message) => (
          <tr key={message.key}>
            <td style={tdStyle}>{message.val.name}:</td>
            <td style={tdStyle}>{message.val.text}</td>
            <td style={tdStyle}>
              <div>{message.val.timeStamp}</div>
            </td>
            <td style={tdStyle}>
              <button onClick={() => startUpdate(message)}>Edit</button>
            </td>
            <td style={tdStyle}>
              <button onClick={() => deleteMessage(message.key)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <>
      <div>
        <img src={logo} className="logo" alt="Rocket logo" />
      </div>
      <h1>Instagram Bootcamp</h1>

      <div className="card">
        <form
          onSubmit={editing ? editData : writeData} 
          className="form-container"
        >
          <div className="left-align">
            <label>Message: </label>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
          </div>
          <div className="left-align">
            <label>Name: </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />
          </div>
          <input type="submit" value="submit" className="left-align" />
        </form>

        <div className="left-align">{messageListItems}</div>
      </div>
    </>
  );
}

export default App;
