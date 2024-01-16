export default function FirebaseDisplay(props) {
  return (
    <div>
      {props.messages && props.messages.length > 0 ? (
        props.messages.map((message) => (
          <div key={message.key}>
            <p>
              {message.val.content} - {message.val.timestamp}
            </p>
            <button onClick={() => props.startUpdate(message)}>Update</button>
            <button onClick={() => props.deleteItem(message)}>Delete</button>
          </div>
        ))
      ) : (
        <p>No messages available</p>
      )}
    </div>
  );
}
