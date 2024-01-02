import { onChildAdded, ref as databaseRef } from "firebase/database";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "react-bootstrap/Card";
import { database } from "../firebase";
import { useState, useEffect } from "react";

const POSTS_FOLDER_NAME = "posts";
const NewsFeed = () => {
  const [posts, setPosts] = useState([]);

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

  // Convert messages in state to message JSX elements to render
  // let messageListItems = messages.map((message) => (
  //   <li key={message.key}>{message.val}</li>
  // ));

  let postListItems = posts.map((post) => (
    <Card className="card_container" key={post.key}>
      <Card.Img src={post.val.imageLink} className="Card-Img" />
      <Card.Text>{post.val.text}</Card.Text>
    </Card>
  ));

  postListItems.reverse();

  return <ol>{postListItems}</ol>;
};

export default NewsFeed;
