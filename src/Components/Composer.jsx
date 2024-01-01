import { useState, useEffect } from "react";

function Composer(props) {
  return (
    <div className="card">
      <form>
        <label htmlFor="message-input-box">Message: </label>
        <input
          id="message-input-box"
          type="text"
          value={props.messageUserInput}
          onChange={(e) => props.setMessageUserInput(e.target.value)}
        />
        <br />
        <label htmlFor="file-input-box">File Input: </label>
        <input
          id="file-input-box"
          type="file"
          value={props.fileInputValue}
          onChange={(e) => {
            props.setFileInputFile(e.target.files[0]);
            props.setFileInputValue(e.target.value);
          }}
        />
        <br />
        <button onClick={props.writeData}>Send</button>
      </form>
    </div>
  );
}

export default Composer;
