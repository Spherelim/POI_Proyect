import "./ChatInput.css"

import Alert from "../Alert.jsx"
import { useState } from "react"

function ChatInput(){

    const [mostrarAlert,setMostrarAlert]=useState(false)
    const Multimedia = "/src/assets/icons/chat/agregar (w).png"

    return(
        <>
            <div className="chat-input">
                <img src={Multimedia} alt="Multimedia"
                onClick={()=>setMostrarAlert(true)} />

                <input placeholder="Escribe algo..." />

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