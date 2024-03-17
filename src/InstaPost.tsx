import logo from "/logo.png";
import { onChildAdded, push, ref, set } from "firebase/database";
const DB_MESSAGES_KEY = "messages";
import { database } from "./firebase";
import { Button } from "./components/ui/button";
import { useState, useEffect, useRef } from "react";
import { uploadFile } from "./utils";
import { Textarea } from "./components/ui/textarea";

// const writeData = () => {
//   const messageListRef = ref(database, DB_MESSAGES_KEY);
//   const newMessageRef = push(messageListRef);
//   set(newMessageRef, "testtesttest");
// };

export const InstaPost = () => {
  const [post, setPost] = useState<string>("");
  const [file, setFile] = useState<any>("");
  const inputFile: any = useRef(null);
  const [sendBtnState, setSendBtnState] = useState<boolean>(true);

  useEffect(() => {
    console.log("InstaPost");
    console.log("post", post);
    console.log("file", file);
    if (post != "" && file != "") {
      setSendBtnState(false);
    } else setSendBtnState(true);
  });

  // reset file input
  const resetFile = () => {
    if (inputFile.current) {
      inputFile.current.value = "";
    }
  };

  return (
    <div className="col-span-3 col-start-2 mx-0 bg-amber-200 p-10">
      <img src={logo} className="h-20 mb-5 my-0 mx-auto" alt="Rocket logo" />
      <h1 className="text-4xl">Make an Instagram Post </h1>

      <div className="mt-5 flex flex-col items-center gap-5">
        <input
          type="file"
          name="upload"
          id="upload"
          accept=".jpg,.jpeg,.png"
          ref={inputFile}
          className="text-black ml-20"
          onChange={(e) => {
            if (e.target.files) {
              const fileName = e.target.files[0];
              setFile(fileName);
            }
          }}
        />
        <div className="w-9/12">
          <Textarea
            placeholder="write a post..."
            className="mb-3 p-5"
            value={post}
            onChange={(e) => {
              console.log(e.target.value);
              setPost(e.target.value);
            }}
          />
          <Button
            className="ml-2"
            disabled={sendBtnState}
            variant={"secondary"}
            onClick={() => {
              console.log("uploading");
              uploadFile(file, post).then(() => {
                console.log("resetting");
                setPost("");
                resetFile();
              });
            }}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};
