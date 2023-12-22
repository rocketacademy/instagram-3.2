import { Link } from "react-router-dom";
export default function NavBar() {
  return (
    <>
      <Link to="/">
        <button>Login / Logout</button>
      </Link>
      <Link to="/NewsFeed">
        <button>News Feed</button>
      </Link>
    </>
  );
}
