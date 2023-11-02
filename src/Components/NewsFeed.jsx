import { onChildAdded, ref as databaseRef } from "firebase/database";
import Card from "react-bootstrap/Card";
import "./NewsFeed.css";
import { database } from "../firebase";
import { useState, useEffect } from "react";

// Save Firebase folder names as constants to avoid bugs due to misspelling
const POSTS_FOLDER_NAME = "posts";

const NewsFeed = () => {
  // Initialise empty posts array in state to keep local state in sync with Firebase
  // When Firebase changes, update local state, which will update local UI
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
  let postListItems = posts.map((post) => (
    <Card className="m-3" bg="secondary" text="white" key={post.key}>
      <Card.Img src={post.val.imageLink} className="Card-Img" />
      <Card.Text>{post.val.authorEmail}</Card.Text>
      <Card.Text>{post.val.text}</Card.Text>
    </Card>
  ));
  // Reverse the order of posts such that newest posts are on top
  postListItems.reverse();

  return <ol>{postListItems}</ol>;
};

export default NewsFeed;
