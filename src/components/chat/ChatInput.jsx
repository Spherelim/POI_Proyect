import "./ChatInput.css"

import Alert from "../Alert.jsx"
import { useState } from "react"

import MultimediaIcon from "/src/assets/icons/chat/agregar (w).png"

import { API_URL } from "../../utils/api.js"

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