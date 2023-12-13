export default function FirebaseDisplay(props) {
  // Convert messages in state to message JSX elements to render
  let messageListItems = props.messages.map((message) => (
    <li key={message.key}>
      {message.val.MessageText} {message.val.Timestamp}{" "}
      <p>{message.val.user}</p>
      <img src={message.val.url} alt={message.val.url} />
    </li>
  ));

  return <div>{props.isLoggedIn ? <ul>{messageListItems}</ul> : null}</div>;
}
