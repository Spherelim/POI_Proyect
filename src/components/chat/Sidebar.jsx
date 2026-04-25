import PerfilCard from "./PerfilCard";
import ChatCard from "./ChatCard"
import "./Sidebar.css"
import { useState, useEffect } from "react"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

function Sidebar({cambiarVista, abrirSolicitudes, seleccionarAmigo}){

    const usuario = JSON.parse(localStorage.getItem("usuario"))
    const [amigos, setAmigos] = useState([])

    useEffect(() => {
        fetch(`${API_URL}/amigos/${usuario.id}`)
            .then(r => r.json())
            .then(data => setAmigos(data))
    }, [])

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
                        imagen="src/assets/images/A-1.jpg"
                        NomUser={amigo.NombreUsuario}
                        ultmsg="Toca para chatear"
                        time=""
                        abrirChat={() => {
                            seleccionarAmigo(amigo)
                            cambiarVista("chat")
                        }}
                    />
                ))
            }
        </div>
    )
}

export default Sidebar;