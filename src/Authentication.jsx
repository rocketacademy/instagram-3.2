import AuthForm from "./AuthForm.jsx";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useEffect } from "react";

export default function Authentication({
  isLoggedIn,
  handleSignOut,
  setIsLoggedIn,
}) {
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (user) {
        setIsLoggedIn(user);
        return;
      }
      setIsLoggedIn(null);
    });
  }, [setIsLoggedIn]);

  return (
    <div>
      {isLoggedIn ? (
        <button onClick={handleSignOut}>Sign Out</button>
      ) : (
        <AuthForm />
      )}
    </div>
  );
}
