import logo from "/logo.png";
import "./App.css";
import { onChildAdded, onChildChanged, update, push, ref, set} from "firebase/database";
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
  const [deleting, setDeleting] = useState(false);
  const [deletingData, setDeletingData] = useState({});
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

  let messageListItems = messages.map((message) => (
    <div key={message.key} style={{ margin: "1rem" }}>
      <div>
        {message.val.name}: {message.val.text}
      </div>
      <div>{message.val.timeStamp}</div>
      <button onClick={() => startUpdate(message)}>Edit</button>
      <button onClick={() => startDelete(message)}>Delete</button>
    </div>
  ));

  return (
    <>
      <div>
        <img src={logo} className="logo" alt="Rocket logo" />
      </div>
      <h1>Instagram Bootcamp</h1>

      <div className="card">
      <form onSubmit={editing? editData: writeData} className="form-container">
        <label>Message: </label>
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
        />
        <br></br>
        <label>Name: </label>
        <input type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)}/>
        <br></br>
        <input type="submit" value="submit" />
      </form>
      
      <div style={{margin:"1rem"}}>{messageListItems}</div>
      </div>
    </>
  );
}

export default App;
