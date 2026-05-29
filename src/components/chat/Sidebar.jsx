import PerfilCard from "./PerfilCard";
import ChatCard from "./ChatCard"
import "./Sidebar.css"
import { useState, useEffect } from "react"

import FotoDefault from "/src/assets/images/Conejito.jpg"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

function Sidebar({cambiarVista, abrirSolicitudes, seleccionarAmigo, actualizarSidebar}){

    const usuario = JSON.parse(localStorage.getItem("usuario"))
    const [amigos, setAmigos] = useState([])

    const cargarAmigos = async () => {
        try {
            const res = await fetch(`${API_URL}/amigos/${usuario.id}`)
            const data = await res.json()
            
            // Cargar las fotos de cada amigo
            const amigosConFotos = await Promise.all(
                data.map(async (amigo) => {
                    try {
                        const fotoRes = await fetch(`${API_URL}/usuarios/${amigo.ID_Us}/foto`)
                        const fotoData = await fotoRes.json()
                        return {
                            ...amigo,
                            foto: fotoData.foto ? `${API_URL}${fotoData.foto}` : FotoDefault
                        }
                    } catch (error) {
                        return { ...amigo, foto: FotoDefault }
                    }
                })
            )
            
            setAmigos(amigosConFotos)
        } catch (error) {
            console.error("Error cargando amigos:", error)
        }
    }

    useEffect(() => {
        cargarAmigos()
    }, [])

    useEffect(() => {
        if (actualizarSidebar) {
            cargarAmigos()
        }
    }, [actualizarSidebar])

    const handleSeleccionarAmigo = (amigo) => {
        seleccionarAmigo(amigo)
        cambiarVista("chat")
    }

    return(
        <div className="sidebar">
            <PerfilCard cambiarVista={cambiarVista} abrirSolicitudes={abrirSolicitudes}/>

            <input className="search" placeholder="Busca un chat..."/>

            {amigos.length === 0
                ? <p style={{color:"rgba(255,255,255,0.5)", fontSize:"13px", textAlign:"center", marginTop:"20px"}}>
                    No tienes amigos aún
                  </p>
                : amigos.map(amigo => (
                    <ChatCard
                        key={amigo.ID_Us}
                        imagen={amigo.foto}
                        NomUser={amigo.NombreUsuario}
                        ultmsg="Toca para chatear"
                        time=""
                        abrirChat={() => handleSeleccionarAmigo(amigo)}
                    />
                ))
            }
        </div>
    )
}

export default Sidebar;