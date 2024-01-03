import React from 'react'
import { useNavigate } from "react-router-dom";

function PostsDisplay({
  messages,
  startUpdate,
  deleteMessage,
  addLike,
  addDislikes,
  isLoggedIn,
  user
}) {
  const navigate = useNavigate()
  const tdStyle = { border: "1px solid white", padding: "10px" };

  let messageListItems = (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th style={tdStyle}>Name</th>
          <th style={tdStyle}>Post</th>
          <th style={tdStyle}>Timestamp</th>
          <th style={tdStyle}>Edit</th>
          <th style={tdStyle}>Delete</th>
          <th style={tdStyle}>Picture</th>
          <th style={tdStyle}>Like</th>
          <th style={tdStyle}>Dislike</th>
        </tr>
      </thead>
      <tbody>
        {messages.map((message) => (
          <tr key={message.key}>
            <td style={tdStyle}>{message.val.name}</td>
            <td style={tdStyle}>{message.val.text}</td>
            <td style={tdStyle}>
              <div>{message.val.timeStamp}</div>
            </td>
            <td style={tdStyle}>
              {isLoggedIn && message.val.name == user.email ? (
                <button onClick={() => {
                  startUpdate(message)
                  navigate("/form")
                } }>Edit</button>
              ) : null}
            </td>
            <td style={tdStyle}>
              {isLoggedIn && message.val.name == user.email ? (
                <button onClick={() => deleteMessage(message.key)}>
                  Delete
                </button>
              ) : null}
            </td>
            <td style={tdStyle}>
              <img
                src={message.val.url}
                alt=""
                width="200px"
                height={"200px"}
              ></img>
            </td>
            <td style={tdStyle}>
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    addLike(message);
                  }}
                >
                  Like
                </button>
              ) : null}
              <p>Number: {message.val.likes}</p>
            </td>
            <td style={tdStyle}>
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    addDislikes(message);
                  }}
                >
                  Dislike
                </button>
              ) : null}
              <p>Number: {message.val.dislikes}</p>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return <div>{messageListItems}</div>;
}

export default PostsDisplay