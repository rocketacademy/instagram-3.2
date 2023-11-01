import logo from "/logo.png";
import "./App.css";
import { onChildAdded, push, ref as databaseRef, set } from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import Card from "react-bootstrap/Card";
import { database, storage } from "./firebase";
import { useState, useEffect } from "react";

// Save Firebase folder names as constants to avoid bugs due to misspelling
const IMAGES_FOLDER_NAME = "images";
const POSTS_FOLDER_NAME = "posts";
// Note is has moved from "messages"

function App() {
  const [posts, setPosts] = useState([]);
  const [textInputValue, setTextInputValue] = useState("");
  const [fileInputFile, setFileInputFile] = useState(null);
  const [fileInputValue, setFileInputValue] = useState("");

  useEffect(() => {
    const messagesRef = databaseRef(database, POSTS_FOLDER_NAME);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      setPosts((prevState) =>
        // Store message key so we can use it as a key in our list items when rendering messages
        [...prevState, { key: data.key, val: data.val() }]
      );
    });
  }, []);

  const writeData = (e) => {
    // Prevent default form submit behaviour that will reload the page
    e.preventDefault();

    // Store images in an images folder in Firebase Storage
    const fileRef = storageRef(
      storage,
      `${IMAGES_FOLDER_NAME}/${fileInputFile.name}`
    );

    // Upload file, save file download URL in database with post text
    uploadBytes(fileRef, fileInputFile).then(() => {
      getDownloadURL(fileRef).then((downloadUrl) => {
        const postListRef = databaseRef(database, POSTS_FOLDER_NAME);
        const newPostRef = push(postListRef);
        set(newPostRef, {
          imageLink: downloadUrl,
          text: textInputValue,
        });
        // Reset input field after submit
        setTextInputValue("");
        setFileInputFile("");
        setFileInputValue(null);
      });
    });
  };

  // Convert messages in state to message JSX elements to render
  let postListItems = posts.map((post) => (
    <Card bg="dark" text="white" key={post.key}>
      <Card.Img src={post.val.imageLink} className="Card-Img" />
      <Card.Text>{post.val.text}</Card.Text>
    </Card>
  ));
  // Reverse the order of posts such that newest posts are on top
  postListItems.reverse();

  return (
    <>
      <div>
        <img src={logo} className="logo" alt="Rocket logo" />
      </div>
      <h1>Instagram Bootcamp</h1>
      <div className="card">
        <form onSubmit={writeData}>
          <input
            type="file"
            value={fileInputValue}
            onChange={(e) => {
              setFileInputFile(e.target.files[0]);
              setFileInputValue(e.target.value);
            }}
          />
          <br />
          <input
            type="text"
            value={textInputValue}
            onChange={(e) => setTextInputValue(e.target.value)}
          />
          <input
            type="submit"
            value="Send"
            // Disable Send button when text input is empty
            disabled={!textInputValue}
          />
        </form>
        <ol>{postListItems}</ol>
      </div>
    </>
  );
}

export default App;
