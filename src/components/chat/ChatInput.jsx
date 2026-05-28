import "./ChatInput.css"

import Alert from "../Alert.jsx"
import { useState } from "react"

import MultimediaIcon from "/src/assets/icons/chat/agregar (w).png"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

function ChatInput({mensaje,setMensaje,enviarMensaje}){

    const [mostrarAlert,setMostrarAlert]=useState(false)

    return(
        <>
            <div className="chat-input">
                <img src={MultimediaIcon} alt="Multimedia"
                onClick={()=>setMostrarAlert(true)} />

                <input placeholder="Escribe algo..." 
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                onKeyPress={(e) =>{ 
                    if (e.key === "Enter") {
                        enviarMensaje()
                    }
                    }
                }
                />

            </div>

            {mostrarAlert &&(
                <Alert
                    Titulo="Multimedia"
                    mensaje="Mostrar Hover de Multimedia"
                    cerrar={()=>setMostrarAlert(false)}
                />
            )}
        </>
    )
}

export default ChatInput;