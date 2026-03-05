import {Routes,Route} from "react-router-dom"
import Home from "./pages/Home"
import Chat from "./pages/Chat"
import Login from "./pages/Login"
import SingUp from "./pages/Singup"

function App(){
  return(    
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Chat" element={<Chat />} />
      <Route path="/Login" element={<Login/>} />
      <Route path="/Singup" element={<SingUp/>} />
    </Routes>
  )
}

export default App
