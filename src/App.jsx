import "./App.css";
import Chat from "./Chat";
import Post from "./Post";
import LoginSignup from "./LoginSignup";

function App() {
  return (
    <>
      <h1>notInstagram</h1>
      <div className="card">
        <Chat />
        <br />
        <Post />
        <br />
        <LoginSignup />
      </div>
    </>
  );
}

export default App;
