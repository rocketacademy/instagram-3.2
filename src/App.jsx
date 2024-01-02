import "./App.css";
import Composer from "./Components/Composer";
import NewsFeed from "./Components/Newsfeed";
import AuthForm from "./Components/AuthForm";
import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthForm setUser={setUser} setIsLoggedIn={setIsLoggedIn} />,
    },
    {
      path: "/form",
      element: <Composer setIsLoggedIn={setIsLoggedIn} setUser={setUser} />,
    },
  ]);

  return (
    <div>
      {isLoggedIn ? <h2>Welcome Back {user.email}</h2> : null}
      <div></div>
      <RouterProvider router={router} />
      <NewsFeed />
    </div>
  );
}

export default App;
