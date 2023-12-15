import { useState, useEffect } from "react";
import { onChildAdded, push, ref, set, remove, onChildRemoved } from "firebase/database";
import { signOut } from "firebase/auth";
import { database, storage } from "./firebase";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "./firebase.jsx";

export default function PostDisplay({ user, setUser, setIsLoggedIn, IsLoggedIn }) {
  const [inputTextValue, setInputTextValue] = useState("");
  const [fileInputFile, setFileInputFile] = useState(null);
  const [messages, setMessages] = useState([]);

  const DB_MESSAGES_KEY = "messages";
  const DB_STORAGE_KEY = "images";
  const currentDate = new Date().toLocaleString();

  useEffect(() => {
    const messagesRef = ref(database, DB_MESSAGES_KEY);
    onChildAdded(messagesRef, (data) => {
      setMessages((prevState) => [...prevState, { key: data.key, val: data.val() }]);
    });
    onChildRemoved(messagesRef, (data) => {
      setMessages((prevState) => prevState.filter((item) => item.key !== data.key));
    });
  }, []);

  const writeData = async (e) => {
    e.preventDefault();
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    const storageRefInstance = storageRef(storage, DB_STORAGE_KEY + (fileInputFile ? fileInputFile.name : ""));
    try {
      if (fileInputFile) {
        console.log("File Input:", fileInputFile);
        await uploadBytes(storageRefInstance, fileInputFile);
        const url = await getDownloadURL(storageRefInstance);
        set(newMessageRef, {
          Comment: inputTextValue,
          Timestamp: currentDate,
          url: url,
        });
      } else {
        set(newMessageRef, {
          Comment: inputTextValue,
          Timestamp: currentDate,
        });
      }
    } catch (err) {
      console.log("Error:", err);
    }
    setInputTextValue("");
    setFileInputFile(null);
  };

  const deleteMessage = (messageKey) => {
    const updatedMessageList = messages.filter((message) => message.key !== messageKey);
    setMessages(updatedMessageList);
    remove(ref(database, `${DB_MESSAGES_KEY}/${messageKey}`));
  };

  const handleSignOut = () => {
    signOut(auth).then(() => {
      setIsLoggedIn(false);
      setUser({});
    });
  };
  console.log("setIsLoggedIn:", setIsLoggedIn);

  return (
    <div className="card">
      {Object.keys(user).length !== 0 ? <p> welcome, {user.email} </p> : null}
      <br />
      {IsLoggedIn ? (
        <button className="m-1 p-2 bg-orange-300" onClick={handleSignOut}>
          Sign out
        </button>
      ) : null}
      {/* SECTION: Text input + Attach Image button */}
      <form onSubmit={writeData} className="mb-4">
        <input
          className="w-full border bg-teal-100 border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 mb-2"
          type="text"
          value={inputTextValue}
          onChange={(e) => setInputTextValue(e.target.value)}
          placeholder="Type your message..."
        />

        <input
          className="flex-1 bg-blue-200 hover:bg-blue-400 rounded-lg px-4 py-1 cursor-pointer"
          type="file"
          onChange={(e) => setFileInputFile(e.target.files[0])}
        />
        <input className="flex-1 bg-green-200 hover:bg-cyan-600 rounded-lg px-4 py-1" type="submit" value="Submit" />
      </form>

      {/* SECTION: RENDERING OUT TIME/DATE, CHATS , IMG */}
      <div className="flex flex-col md:flex-row flex-wrap justify-evenly">
        {/* SUB-SECTION: IMG RENDER */}
        <div>
          <h2 className="p-2 text-lg">Time & Date</h2>
          <ul>
            {messages.reverse().map((message) => (
              <li className="p-2 flex items-center" key={message.key}>
                {message.val.Timestamp}
              </li>
            ))}
          </ul>
        </div>
        {/* SUB-SECTION: IMG RENDER */}
        <div>
          <h2 className="p-2 text-lg">Picture</h2>
          {messages.map((message) => (
            <li className="p-2 flex items-center" key={message.key}>
              {message.val.url ? (
                <img className="mr-2" src={message.val.url} alt={message.val.url} width="200" height="200" />
              ) : (
                <p>No image uploaded</p>
              )}
            </li>
          ))}
        </div>
        {/* SUB-SECTION: CHAT RENDER */}
        <div>
          <h2 className="p-2 text-lg">Comment</h2>
          <ul>
            {messages.map((message) => (
              <li className="p-2 flex items-center " key={message.key}>
                <span className="flex-1">{message.val.Comment}</span>
                {IsLoggedIn ? (
                  <button
                    className="ml-auto rounded-lg outline outline-offset-2 outline-blue-300"
                    onClick={() => deleteMessage(message.key)}
                  >
                    Delete
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
