import {Routes,Route} from "react-router-dom"
import Home from "./pages/Home"
import Chat from "./pages/Chat"
import Login from "./pages/Login"
import SingUp from "./pages/Singup"
import "./App.css"

import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function App(){
  return(    
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Chat" element={<Chat />} />
        <Route path="/Login" element={<Login/>} />
        <Route path="/Singup" element={<SingUp/>} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </>
  )
}

export default App
