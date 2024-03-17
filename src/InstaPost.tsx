import logo from "/logo.png";
import { onChildAdded, push, ref, set } from "firebase/database";
const DB_MESSAGES_KEY = "messages";
import { database } from "./firebase";
import { Button } from "./components/ui/button";
import { useState, useEffect } from "react";

const writeData = () => {
  const messageListRef = ref(database, DB_MESSAGES_KEY);
  const newMessageRef = push(messageListRef);
  set(newMessageRef, "testtesttest");
};

export const InstaPost = () => {
  const [post, setPost] = useState<string>("");
  const [sendBtnState, setSendBtnState] = useState<boolean>(true);

  useEffect(() => {
    if (post != "") {
      setSendBtnState(false);
    } else setSendBtnState(true);
  }, [post]);

  return (
    <div className="col-span-3 col-start-2 mx-0 bg-amber-200 p-10">
      <img src={logo} className="h-20 mb-5 my-0 mx-auto" alt="Rocket logo" />
      <h1 className="text-4xl">Make a Instagram Post </h1>
      <div className="mt-5">
        <input
          type="text"
          id="post"
          className="mb-3 p-5"
          onChange={(e) => {
            console.log(e.target.value);
            setPost(e.target.value);
          }}
        />
        <Button
          disabled={sendBtnState}
          variant={"secondary"}
          onClick={writeData}
        >
          Send
        </Button>
      </div>
    </div>
  );
};
