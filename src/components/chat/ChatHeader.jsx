import "./ChatHeader.css"
import Alert from "../Alert.jsx"
import { useState } from "react"

function ChatHeader({abrirInfo}){

    const [mostrarAlert,setMostrarAlert]=useState(false)

    let imagen="/src/assets/images/A-1.jpg"

    const Llamar = "/src/assets/icons/Llamada/llamada-telefonica 1 (w).png"
    const VidLlamada = "/src/assets/icons/Llamada/video-camara-alt (w).png"
    const Buscar = "/src/assets/icons/busqueda (w).png"
    
    return(
        <>
            <div className="chat-header">
                
                <div className="user-info">
                    <img src={imagen} alt="Img_User" onClick={abrirInfo} />

                    <div>
                        <h3>User Name</h3>
                        <span className="status">Desconectado</span>
                    </div>

                </div>

                <div className="icons">
                    <img src={Llamar} alt="llamada" 
                    onClick={()=>setMostrarAlert(true)} />

                    <img src={VidLlamada} alt="video llamada"
                    onClick={()=>setMostrarAlert(true)} />

                    <img src={Buscar} alt="buscarMensaje" />
                </div>

            </div>

            {mostrarAlert &&(
                <Alert
                    Titulo="Llamando..."
                    mensaje="Llamando a este usuario..."
                    cerrar={()=>setMostrarAlert(false)}
                />
            )}
        </>
    )
}

export default ChatHeader