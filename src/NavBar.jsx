import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar">
      <Link to="/"></Link>
      <Link to="/newsfeed">News Feed</Link>
      {/* Add other navigation links as needed */}
    </div>
  );
}

export default Navbar;
