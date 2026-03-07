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

import { useState } from "react"

function Chat(){

    const [visita,setVista]=useState("chat")

    const [mostrarInfo,setMostrarInfo] = useState(false)

    return (
        <div className="Content-Chat">
            <Sidebar cambiarVista={setVista}/>

            <div className="Chat-area">
                
                {visita === "chat" &&(
                    <>
                        <ChatHeader abrirInfo={()=>setMostrarInfo(true)}/>

                        <div className="chat-messages">
                            <Message text="Hola." type="left"/>
                            <Message text="Hola." type="right"/>
                        </div>

                        <ChatInput/>
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