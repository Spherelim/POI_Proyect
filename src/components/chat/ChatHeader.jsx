import "./ChatHeader.css"
import Alert from "../Alert.jsx"
import { useState, useEffect } from "react"
import { socket } from "../../socket.js"

function ChatHeader({abrirInfo, amigo}){

    const [mostrarAlert,setMostrarAlert] = useState(false)
    const [activo, setActivo] = useState(false)

    // Si no hay amigo, mostrar placeholder
    if (!amigo || !amigo.ID_Us) {
        return (
            <div className="chat-header">
                <div className="user-info">
                    <div>
                        <h3>Sin chat seleccionado</h3>
                        <span className="status">---</span>
                    </div>
                </div>
            </div>
        )
    }

    const AvatarDefault = () => (
        <svg width="45" height="45" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
    )

    useEffect(() => {
        if (!amigo?.ID_Us) return

        const handleStatus = (status) => {
            setActivo(status === "online")
        }

        socket.on(`user_status_${amigo.ID_Us}`, handleStatus)

        socket.emit("check_status", amigo.ID_Us, (isOnline) => {
            setActivo(isOnline || false)
        })

        return () => {
            socket.off(`user_status_${amigo.ID_Us}`, handleStatus)
        }
    }, [amigo?.ID_Us])

    const Llamar = "/src/assets/icons/Llamada/llamada-telefonica 1 (w).png"
    const VidLlamada = "/src/assets/icons/Llamada/video-camara-alt (w).png"
    const Buscar = "/src/assets/icons/busqueda (w).png"
    
    return(
        <>
            <div className="chat-header">
                
                <div className="user-info">
                    {amigo?.imagen ? (
                        <img src={amigo.imagen} alt="Img_User" onClick={abrirInfo} />
                    ) : (
                        <div onClick={abrirInfo} style={{cursor: "pointer"}}>
                            <AvatarDefault/>
                        </div>
                    )}

                    <div>
                        <h3>{amigo.NombreUsuario || "Usuario"}</h3>
                        <span className="status" style={{color: activo ? "#4CAF50" : "#aaa"}}>
                            {activo ? "● Activo" : "○ Desconectado"}
                        </span>
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