import "./Chat.css"

import Sidebar from "../components/chat/Sidebar"
import ChatHeader from "../components/chat/ChatHeader"
import ChatInput from "../components/chat/ChatInput"
import Message from "../components/chat/Message"

import ChatInfoPanel from "../components/chat/ChatInfoPanel"

import Settings from "../components/Settings"
import Notificacion from "../components/Notificacion"
import Tareas from "../components/Tareas"
import Solicitudes from "../components/Solicitudes"

//vamos a ver como jala esta madre
import {useEffect,useState} from "react"
import {socket}from "../socket"

function Chat(){

    const [visita,setVista]=useState("chat")

    const [mostrarInfo,setMostrarInfo] = useState(false)

    const [mensaje,setMensaje]=useState("")
    const [mensajes,setMensajes]=useState([])

    useEffect(() => {
        socket.on("mensaje", (data) => {
            setMensajes((prev) => [...prev, data])
        })

        return () => {
            socket.off("mensaje")
        }
    }, [])

    const enviarMensaje = () => {
        if (mensaje.trim() === "") return

        socket.emit("mensaje", {
            text:mensaje,
            type:"right"
        })
        setMensaje("")
    }

    // no pongan mensajes adentro xd, se muestran aksdjaskd
    return (
        <div className="Content-Chat">
            <Sidebar cambiarVista={setVista}/>

            <div className="Chat-area">
                
                {visita === "chat" &&(
                    <>
                        <ChatHeader abrirInfo={()=>setMostrarInfo(true)}/>

                        <div className="chat-messages">
                            {mensajes.map((msg,index) => (
                                <Message 
                                    key={index} 
                                    text={msg.text} 
                                    type={msg.type}
                                />
                            ))}
                        </div>

                        <ChatInput
                            mensaje={mensaje}
                            setMensaje={setMensaje}
                            enviarMensaje={enviarMensaje}
                        />
                    </>
                )}

                {visita === "ajustes" && (
                    <>
                        <ChatHeader/>
                        <Settings/>

                    </>
                )}

                {visita === "noti" && (
                    <>
                        <ChatHeader/>
                        <Notificacion/>

                    </>
                )}

                {visita === "tareas" && (
                    <>
                        <ChatHeader/>
                        <Tareas/>

                    </>
                )}

                {visita === "soli" && (
                    <>
                        <ChatHeader/>
                        <Solicitudes/>
                        
                    </>
                )}

            </div>

            {mostrarInfo && (
                <ChatInfoPanel cerrarInfo={()=>setMostrarInfo(false)}/>
            )}

        </div>
    )
}

export default Chat