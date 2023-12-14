import { RouterProvider, createBrowserRouter, Navigate, Route } from 'react-router-dom';
import Texts from './Component/Text.jsx'
import "./App.css";
import AuthPage from './Component/AuthPage.jsx';
import { useState } from 'react';


function App() {
  const [isAuth, setIsAuth] = useState(false)
  const [user, setUser]= useState({})
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Texts user={user} />
      ),
    },
    {
      path:"/welcome",
      element:(
        <AuthPage isAuth={isAuth} setIsAuth={setIsAuth} user={user} setUser={setUser} />
      )
    }
  ])
  return(
    <RouterProvider router={router}/>
  )
}

export default App;
