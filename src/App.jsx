import "./App.css";
import { useState } from "react";
import LoginSignUp from "./Components/LoginSignup";
import PostDisplay from "./Components/PostDisplay";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./Components/Navbar";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div>
          <Navbar />
          <br />
          <LoginSignUp setUser={setUser} setIsLoggedIn={setIsLoggedIn} />
        </div>
      ),
    },
    {
      path: "/PostsDisplay",
      element: (
        <div>
          <Navbar />
          <br />
          <PostDisplay setUser={setUser} user={user} setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />
        </div>
      ),
    },
  ]);

  return (
    <div className="bg-gradient-to-b from-cyan-300 to-white-100 shadow-2xl dark:bg-grey-400 px-3 py-2 rounded-lg">
      <h1 className="text-2xl font-bold text-rose-500 mb-4">Rocketgram</h1>

      <RouterProvider router={router}>
        <router />
      </RouterProvider>
    </div>
  );
}

export default App;
