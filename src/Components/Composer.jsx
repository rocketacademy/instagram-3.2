import { push, ref as databaseRef, set } from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { useState } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { database, storage } from "../firebase";
import { useNavigate } from "react-router-dom";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
// const DB_MESSAGES_KEY = "messages";
const IMAGES_FOLDER_NAME = "images";
const POSTS_FOLDER_NAME = "posts";

const Composer = (props) => {
  // const [messages, setMessages] = useState([]);
  const [textInputValue, setTextInputValue] = useState("");
  const [fileInputFile, setFileInputFile] = useState(null);
  const navigate = useNavigate();

  const writeData = (e) => {
    e.preventDefault();
    // const messageListRef = databaseRef(database, DB_MESSAGES_KEY);
    // const newMessageRef = push(messageListRef);
    // set(newMessageRef, textInputValue);
    // setTextInputValue("");
    if (fileInputFile) {
      const imageRef = storageRef(
        storage,
        `${IMAGES_FOLDER_NAME}/${fileInputFile.name}`
      );

      uploadBytes(imageRef, fileInputFile).then(() => {
        getDownloadURL(imageRef).then((url) => {
          const postListRef = databaseRef(database, POSTS_FOLDER_NAME);
          const newPostRef = push(postListRef);
          set(newPostRef, {
            imageLink: url,
            text: textInputValue,
          });
          setFileInputFile(null);
        });
      });
    }
  };
  return (
    <>
      <div className="card">
        {/* TODO: Add input field and add text input as messages in Firebase */}
        <form onSubmit={writeData}>
          <input
            type="file"
            onChange={(e) => setFileInputFile(e.target.files[0])}
          />
          <input
            type="text"
            value={textInputValue}
            onChange={(e) => setTextInputValue(e.target.value)}
          />
          <button type="submit" disabled={!textInputValue}>
            Send
          </button>
        </form>
        <button
          onClick={() => {
            signOut(auth).then(() => {
              props.setIsLoggedIn(false);
              props.setUser({});
              navigate("/");
            });
          }}
        >
          Sign Out
        </button>
      </div>
    </>
  );
};
export default Composer;
