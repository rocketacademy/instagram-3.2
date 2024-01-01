import { database } from "../firebase";

import { ref as databaseRef, update, onValue } from "firebase/database";

function Newsfeed(props) {
  let passedinmessages = props.messages;

  const handleLikes = (key) => {
    const likeCountRef = databaseRef(
      database,
      props.DB_MESSAGES_KEY + "/" + key
    );
    console.log(key);
    //when setting, firebase allocates a random key to the object if not specified

    let prev_likecount = 0;
    onValue(likeCountRef, (snapshot) => {
      const data = snapshot.val();
      prev_likecount = data.like_count;
    });

    update(likeCountRef, {
      like_count: prev_likecount + 1,
    });
  };

  let messageListItems = passedinmessages.map((passedinmessage) => (
    <div className="message-box" key={passedinmessage.key}>
      <p>{passedinmessage.val.textSent}</p>

      <img src={passedinmessage.val.url} />

      <div className="msgboxmetadata">
        <div className="msgboxmetadata-item">
          <button id="heart"></button>
        </div>

        <div className="msgboxmetadata-item">
          <p>Likes: </p>
          <p>{passedinmessage.val.like_count}</p>
        </div>

        <div className="msgboxmetadata-item">
          <p>Message Author:</p>
          <p> {passedinmessage.val.user}</p>
        </div>

        <div className="msgboxmetadata-item">
          <p>Time Sent: </p>
          <p>{passedinmessage.val.date}</p>
        </div>

        <div className="msgboxmetadata-item">
          <p>Key:</p>
          <p>{passedinmessage.key}</p>
        </div>

        <div className="msgboxmetadata-item">
          <button onClick={() => handleLikes(passedinmessage.key)}>Like</button>
        </div>
      </div>
    </div>
  ));

  return messageListItems;
}

export default Newsfeed;
