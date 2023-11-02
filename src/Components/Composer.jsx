import { push, ref as databaseRef, set } from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { useState } from "react";
import { database, storage } from "../firebase";

// Save Firebase folder names as constants to avoid bugs due to misspelling
const IMAGES_FOLDER_NAME = "images";
const POSTS_FOLDER_NAME = "posts";

const Composer = (props) => {
  const [textInputValue, setTextInputValue] = useState("");
  const [fileInputFile, setFileInputFile] = useState(null);
  const [fileInputValue, setFileInputValue] = useState("");

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
          authorEmail: props.loggedInUser.email,

          text: textInputValue,
        });
        // Reset input field after submit
        setTextInputValue("");
        setFileInputFile("");
        setFileInputValue(null);
      });
    });
  };

  return (
    <form className="text-white" onSubmit={writeData}>
      <p>{props.loggedInUser ? props.loggedInUser.email : null}</p>

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
  );
};

export default Composer;
