import "./ChatHeader.css"
import Alert from "../Alert.jsx"
import { useState, useEffect } from "react"
import { socket } from "../../socket.js"

import FotoDefault from "/src/assets/images/Conejito.jpg"

import LlamarIcon from "/src/assets/icons/Llamada/llamada-telefonica 1 (w).png"
import VidLlamadaIcon from "/src/assets/icons/Llamada/video-camara-alt (w).png"
import BuscarIcon from "/src/assets/icons/busqueda (w).png"
import IzquierdaIcon from "/src/assets/images/Flechas/izquierda (w).png"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

function ChatHeader({abrirInfo, amigo, onVolver, onIniciarLlamada}){

    const [activo, setActivo] = useState(false)
    const [fotoAmigo, setFotoAmigo] = useState(null)

    // Cargar foto del amigo o grupo cuando cambia
    useEffect(() => {
        if (!amigo) return;
        
        if (amigo.esGrupo) {
            setFotoAmigo(amigo.fotoGrupo ? `${API_URL}${amigo.fotoGrupo}` : FotoDefault)
        } else if (amigo.ID_Us) {
            fetch(`${API_URL}/usuarios/${amigo.ID_Us}/foto`)
                .then(res => res.json())
                .then(data => {
                    if (data.foto) {
                        setFotoAmigo(`${API_URL}${data.foto}`)
                    } else {
                        setFotoAmigo(FotoDefault)
                    }
                })
                .catch(err => console.error("Error cargando foto:", err))
        }
    }, [amigo])

    // Si no hay amigo seleccionado ni grupo
    if (!amigo || (!amigo.ID_Us && !amigo.esGrupo)) {
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

    // Monitoreo de estado online solo si es un usuario individual (no para grupos)
    useEffect(() => {
        if (!amigo || amigo.esGrupo || !amigo.ID_Us) return

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
    }, [amigo])
    
    return(
        <>
            <div className="chat-header">

                {/* Botón de volver — solo visible en móvil */}
                {onVolver && (
                    <button 
                        className="btn-volver-mobile" 
                        onClick={onVolver} 
                        aria-label="Volver"
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none" }}
                    >
                        <img src={IzquierdaIcon} alt="Volver" style={{ width: "22px", height: "22px", objectFit: "contain" }} />
                    </button>
                )}

                <div className="user-info">
                    {fotoAmigo ? (
                        <img src={fotoAmigo} alt="Img_User" onClick={abrirInfo} style={{cursor: "pointer"}} />
                    ) : (
                        <div onClick={abrirInfo} style={{cursor: "pointer"}}>
                            <AvatarDefault/>
                        </div>
                    )}

                    <div>
                        <h3>{amigo.esGrupo ? amigo.nombreGrupo : (amigo.NombreUsuario || "Usuario")}</h3>
                        <span className="status" style={{color: amigo.esGrupo ? "#a8a5e6" : (activo ? "#4CAF50" : "#aaa")}}>
                            {amigo.esGrupo ? "Grupo" : (activo ? "● Activo" : "○ Desconectado")}
                        </span>
                    </div>

                </div>

                {!amigo.esGrupo && (
                    <div className="icons">
                        <img src={LlamarIcon} alt="llamada" 
                        onClick={() => onIniciarLlamada && onIniciarLlamada("audio")} 
                        style={{ cursor: "pointer" }} />

                        <img src={VidLlamadaIcon} alt="video llamada"
                        onClick={() => onIniciarLlamada && onIniciarLlamada("video")} 
                        style={{ cursor: "pointer" }} />
                    </div>
                )}

            </div>
        </>
    )
}


export default ChatHeader