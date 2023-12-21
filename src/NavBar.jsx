import { Link } from "react-router-dom";
export default function NavBar() {
  return (
    <>
      <Link to="/instagram-3.2/">
        <button>Login / Logout</button>
      </Link>
      <Link to="/instagram-3.2/NewsFeed">
        <button>News Feed</button>
      </Link>
    </>
  );
}
