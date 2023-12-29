import { useEffect, useState } from "react";
import {
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  ref as databaseRef,
  remove,
  update,
} from "firebase/database";
import { deleteObject, ref as storageRef } from "firebase/storage";

import { database, storage } from "./firebase";

const DB_MESSAGES_KEY = "messages";
const DB_IMAGES_KEY = "images";
const messagesRef = databaseRef(database, DB_MESSAGES_KEY);

export default function NewsFeed({ isLoggedIn, uid }) {
  const [messages, setMessages] = useState([]);
  const [isEditing, setIsEditing] = useState([]);
  const [editValue, setEditValue] = useState("");
  const [liked, setLiked] = useState([]);

  useEffect(() => {
    onChildAdded(messagesRef, (data) =>
      setMessages((prev) => [...prev, { key: data.key, val: data.val() }])
    );
    onChildRemoved(messagesRef, (data) =>
      setMessages((prev) => prev.filter((item) => item.key !== data.key))
    );
    onChildChanged(messagesRef, (data) =>
      setMessages((prev) =>
        prev.map((item) =>
          item.key === data.key ? { key: data.key, val: data.val() } : item
        )
      )
    );
  }, []);

  useEffect(() => {
    //amount of "false" in array to be same as messages.length
    setIsEditing([...Array(messages.length)].fill(false));
    setLiked(messages.map((message) => !!message.val.like[uid]));
  }, [messages, uid]);

  const likeUnlike = (data, index) => {
    if (liked[index]) {
      setLiked((prev) => prev.with(index, !prev[index]));
      update(databaseRef(database, DB_MESSAGES_KEY + "/" + data.key), {
        likeCount: data.val.likeCount - 1,
        like: { ...data.val.like, [uid]: false },
      });
    } else {
      setLiked((prev) => prev.with(index, !prev[index]));
      update(databaseRef(database, DB_MESSAGES_KEY + "/" + data.key), {
        likeCount: data.val.likeCount + 1,
        like: { ...data.val.like, [uid]: true },
      });
    }
  };

  const editData = (data, index) => {
    setEditValue(data?.val?.message);
    setIsEditing((prev) => prev.with(index, !prev[index]));
    if (isEditing[index]) {
      update(databaseRef(database, DB_MESSAGES_KEY + "/" + data.key), {
        edited: `${new Date()}`,
        message: editValue,
      });
      setEditValue("");
    }
  };

  const deleteData = async (data) => {
    if (data.val.fileName) {
      await deleteObject(
        storageRef(storage, DB_IMAGES_KEY + "/" + data.val.fileName)
      );
    }
    remove(databaseRef(database, DB_MESSAGES_KEY + "/" + data.key));
  };

  return (
    // Convert messages in state to message JSX elements to render
    messages.map((message, index) => (
      <li
        key={message.key}
        style={{
          borderTop: "1px dotted white",
        }}>
        {/* input if editing, else just show message */}
        {isEditing[index] ? (
          <input
            style={{ width: "12.5em", marginRight: "2.3em" }}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
          />
        ) : (
          <div className="text-messages">{message.val.message}</div>
        )}
        <div className="buttons">
          {/* like button that toggles */}
          {liked[index] ? (
            <button
              disabled={!isLoggedIn}
              onClick={() => likeUnlike(message, index)}>
              {message.val.likeCount}
              <iconify-icon
                icon="fa6-solid:heart"
                style={{ color: "red" }}></iconify-icon>
            </button>
          ) : (
            <button
              disabled={!isLoggedIn}
              onClick={() => likeUnlike(message, index)}>
              {message.val.likeCount}
              <iconify-icon
                icon="fa6-regular:heart"
                style={{ color: "red" }}></iconify-icon>
            </button>
          )}

          {/* edit button that also submits edit value, other edit buttons are disabled while editing */}
          <button
            disabled={
              (isEditing.some((bool) => bool === true)
                ? !isEditing[index]
                : isEditing[index]) || message.val.poster !== uid
            }
            onClick={() => editData(message, index)}>
            Edit
          </button>
          <button
            disabled={message.val.poster !== uid}
            onClick={() => deleteData(message)}>
            Delete
          </button>
        </div>
        {/* display image if it exist */}
        <div>
          {!!message?.val?.fileUrl && (
            <img
              src={message.val.fileUrl}
              alt="image"
              style={{ maxWidth: "150px", maxHeight: "150px" }}
            />
          )}
        </div>
        <div className="info">
          <p>Author: {message.val.posterEmail}</p>
          <span style={{ paddingRight: "1.325em" }}>Sent: </span>
          {new Date(message.val.timestamp).toLocaleString()}
          {!!message?.val?.edited && (
            <>
              <br />
              <span>Edited: </span>
              {new Date(message.val.edited).toLocaleString()}
            </>
          )}
        </div>
      </li>
    ))
  );
}
