export default function MessageInput({
  writeData,
  handleInputChange,
  handleImages,
  userInput,
  fileInputValue,
}) {
  return (
    <div className="card">
      <form onSubmit={writeData}>
        Message:
        <input type="text" value={userInput} onChange={handleInputChange} />
        <br />
        <br />
        Upload image:
        <input type="file" value={fileInputValue} onChange={handleImages} />
        <br />
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
