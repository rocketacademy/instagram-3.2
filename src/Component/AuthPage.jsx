import { Button, Form } from "react-bootstrap"
import { Navigate, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";

export default function AuthPage(props){
  let {
    isAuth,
    setIsAuth,
    setUser,
    user,
  } = props

  useEffect(()=>{
    console.log('user: ', user)
    console.log("display name: ", user.displayName)
  },[])

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  const signUp = () =>{
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) =>{
      setIsAuth(true)
      setUser(userCredential.user);
      navigate("/")
    })
    .catch((err) => console.error(err))
  }

  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      setIsAuth(true);
      setUser(userCredential.user)
      navigate('/')
    })
    .catch((err) => console.error(err))
  }

  return (
    <div data-bs-theme="dark">
      <h1>WELCOME</h1>
      <Form>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Control
            autoFocus
            type="email"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Control
            autoFocus
            type="password"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button onClick={signIn} variant="outline-light">
          <i className="fa-solid fa-right-to-bracket"></i>
        </Button>
        <br></br>
        <br></br>
        <br></br>
        <label htmlFor="">No account?</label>
        <br></br>
        <br></br>
        <Button onClick={signUp} variant="outline-light">
          <i className="fa-solid fa-user-plus"></i>{" "}
        </Button>
      </Form>
    </div>
  );
}