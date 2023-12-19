import { useState } from "react";
import { push, set } from "firebase/database";
import { getDownloadURL, uploadBytes } from "firebase/storage";

const DB_MESSAGES_KEY = "messages";
const DB_IMAGES_KEY = "images";

export default function Composer({
  uid,
  database,
  databaseRef,
  storage,
  storageRef,
}) {
  const [inputValue, setInputValue] = useState("");
  const [file, setFile] = useState(null);

  const messagesRef = databaseRef(database, DB_MESSAGES_KEY);

  const writeData = async () => {
    let name = "";
    let url = "";
    if (file) {
      const newStorageRef = storageRef(
        storage,
        DB_IMAGES_KEY + "/" + file.name
      );
      await uploadBytes(newStorageRef, file);
      url = await getDownloadURL(newStorageRef);
      name = file.name;
    }
    set(push(messagesRef), {
      timestamp: `${new Date()}`,
      edited: "",
      message: inputValue,
      fileName: name,
      fileUrl: url,
      likeCount: 0,
      poster: uid,
      like: { [uid]: false },
    });
    setInputValue("");
    setFile(null);
  };

  return (
    <form onSubmit={(e) => (e.preventDefault(), e.target.reset())}>
      <input
        style={{ width: "14.6em", marginRight: "1.4em" }}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button
        style={{ margin: "0.5em" }}
        disabled={!inputValue}
        onClick={writeData}>
        Send
      </button>
      <br />
      <input
        style={{ margin: "0.5em" }}
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />
    </form>
  );
}
