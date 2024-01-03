import Card from "@mui/material/Card";

// Convert messages in state to message JSX elements to render

const MessageList = ({ messages, editMessage, removeMessage }) => {
  const reversedMessages = [...messages].reverse();

  const renderMessages = reversedMessages.map((message) => (
    <Card variant="outlined" key={message.key}>
      <li>
        <p>{message.val.timestamp}</p>
        <p>{message.val.text}</p>
        <img src={message.val.imageURL} alt="Uploaded" />
        <br />
        <button
          type="edit"
          onClick={() => {
            const newText = prompt("Edit your message:");
            if (newText !== null) {
              editMessage(message.key, newText);
            }
          }}
        >
          Edit
        </button>
        <button type="delete" onClick={() => removeMessage(message.key)}>
          Delete
        </button>
      </li>
    </Card>
  ));

  return <ol>{renderMessages}</ol>;
};

export default MessageList;
