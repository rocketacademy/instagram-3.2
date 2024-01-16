import React, { useEffect, useState } from "react";
import {
  onChildAdded,
  push,
  ref,
  set,
  update,
  remove,
} from "firebase/database";
import { database, storage } from "./firebase";

import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

// base solution: upload and delete post
// comfortable: implement likes and comments

const DB_STORAGE_KEY = "images";

export default function Post() {
  const [fileInputFile, setFileInputFile] = useState(null);
  const [fileInputValue, setFileInputValue] = useState("");

  const writeData = (e) => {
    e.preventDefault();
    const storageRefInstance = storageRef(
      storage,
      DB_STORAGE_KEY + fileInputFile.name
    );

    uploadBytes(storageRefInstance, fileInputFile).then(() => {
      getDownloadURL(storageRefInstance).then((url) => {
        // Update the database reference with the download URL
        set(ref(database, "your_database_reference"), { url: url });
      });
    });
  };

  return (
    <div>
      <form onSubmit={writeData}>
        <input
          type="file"
          value={fileInputValue}
          onChange={(e) => {
            setFileInputFile(e.target.files[0]);
            setFileInputValue(e.target.value);
          }}
        />
        <input type="submit" value="Submit" />
      </form>
      <div key={storage.key}>
        {/* <img src={storage.val.url} alt={storage.val.url} /> */}
      </div>

      {/* <FirebaseDisplay
        post={images}
        startUpdate={startUpdate}
        deleteItem={deleteItem}
      /> */}
    </div>
  );
}
