import PerfilCard from "./PerfilCard";
import ChatCard from "./ChatCard"
import "./Sidebar.css"
import { useState, useEffect } from "react"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

function Sidebar({cambiarVista, abrirSolicitudes, seleccionarAmigo, actualizarSidebar}){

    const usuario = JSON.parse(localStorage.getItem("usuario"))
    const [amigos, setAmigos] = useState([])

    const cargarAmigos = async () => {
        try {
            const res = await fetch(`${API_URL}/amigos/${usuario.id}`)
            const data = await res.json()
            console.log("Amigos cargados:", data)
            setAmigos(data)
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
        console.log("Seleccionando amigo:", amigo)
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
                        imagen={amigo.imagen || null}
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