import { Link } from "react-router-dom";
 
function Navbar({isLoggedIn, handleSignOut}) {
  return (
    <div>
      {isLoggedIn ? (
        <div className="navbar">
          <div>
            <Link to="/form">Form</Link>
          </div>
          <div>|</div>
          <div>
            <Link to="/posts">Posts</Link>
          </div>
          <div>|</div>
          <div>
            <Link onClick={handleSignOut}>Sign Out</Link>
          </div>
        </div>
      ) : (
        <div className="navbar">
          <div>
            <Link to="/">Login</Link>
          </div>
          <div>|</div>
          <div>
            <Link to="/posts">Posts</Link>
          </div>
        </div>
      )}
    </div>
  );
}
 
export default Navbar