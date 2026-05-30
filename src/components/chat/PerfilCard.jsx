import "./PerfilCard.css"
import { useState, useEffect } from "react"

import FotoDefault from "/src/assets/images/Conejito.jpg"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

function PerfilCard({cambiarVista, abrirSolicitudes, notificacionesNoLeidas}){

    const usuario = JSON.parse(localStorage.getItem("usuario"))
    const [fotoPerfil, setFotoPerfil] = useState("")
    const [nombreUsuario, setNombreUsuario] = useState(usuario?.nombreUsuario || "Usuario")

    useEffect(() => {
        cargarFotoPerfil()
        
        // Escuchar cambios en localStorage
        const handleStorageChange = () => {
            const updatedUser = JSON.parse(localStorage.getItem("usuario"))
            if (updatedUser) {
                setNombreUsuario(updatedUser.nombreUsuario || "Usuario")
            }
            cargarFotoPerfil()
        }
        
        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [])

    const cargarFotoPerfil = async () => {
        if (!usuario?.id) return
        try {
            const res = await fetch(`${API_URL}/usuarios/detalles/${usuario.id}`)
            const data = await res.json()
            if (data.Foto) {
                setFotoPerfil(`${API_URL}${data.Foto}`)
            } else {
                setFotoPerfil(FotoDefault)
            }
        } catch (error) {
            console.error("Error cargando foto:", error)
        }
    }

    // Solo mantener los iconos de navegación necesarios (sin engranaje — el avatar hace esa función)

    const IconoNoti = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.93 6 11v5l-2 2v1h16v-1l-2-2z"/>
        </svg>
    )

    const IconoTareas = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm4 12h-4v3h-2v-3H8v-2h4V9h2v4h4v2z"/>
        </svg>
    )

    const IconoSolicitud = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
    )

    // agregado
    const IconoTienda = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 6V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H3v2h1v7c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-7h1V6h-3zm-6 0h4v2h-4V6zm8 9H6v-5h12v5z"/>
        </svg>
    )

    return(
        <div className="Perfil-Card">
            <div style={{display: "inline-flex", alignItems: "center", gap: "6px", width: "100%", overflow: "hidden"}}>

                {/* Avatar — clic abre Ajustes de perfil */}
                <div
                    title="Ver mi perfil y ajustes"
                    onClick={() => cambiarVista("ajustes")}
                    style={{
                        width: "40px",
                        height: "40px",
                        minWidth: "40px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        flexShrink: 0,
                        background: "rgba(255,255,255,0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        border: "2px solid transparent",
                        transition: "border-color 0.2s"
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(102,126,234,0.7)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}
                >
                    {fotoPerfil ? (
                        <img
                            src={fotoPerfil}
                            style={{width: "100%", height: "100%", objectFit: "cover"}}
                            alt="Mi perfil"
                            onError={(e) => { e.target.src = FotoDefault }}
                        />
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                    )}
                </div>

                <span style={{color:"white", fontSize:"13px", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
                    {nombreUsuario}
                </span>
                <div style={{position: "relative", display: "flex", gap: "3px", cursor: "pointer", flexShrink: 0}} onClick={() => cambiarVista("noti")}>
                    <IconoNoti/>
                    {notificacionesNoLeidas > 0 && (
                        <div style={{
                            position: "absolute",
                            top: "0px",
                            right: "0px",
                            background: "#e74c3c", /* Rojo alerta */
                            color: "white",
                            fontSize: "9px",
                            fontWeight: "bold",
                            borderRadius: "50%",
                            width: "14px",
                            height: "14px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 0 4px rgba(0,0,0,0.5)"
                        }}>
                            {notificacionesNoLeidas > 9 ? "9+" : notificacionesNoLeidas}
                        </div>
                    )}
                </div>
                <div style={{display: "flex", gap: "3px", cursor: "pointer", flexShrink: 0}} onClick={() => cambiarVista("tareas")}>
                    <IconoTareas/>
                </div>


                {/* Agregado */}
                <div style={{display: "flex", gap: "3px", cursor: "pointer", flexShrink: 0}} onClick={() => cambiarVista("tienda")}>
                    <IconoTienda/>
                </div>


                <div style={{display: "flex", gap: "3px", cursor: "pointer", flexShrink: 0}} onClick={abrirSolicitudes}>
                    <IconoSolicitud/>
                </div>
            </div>
        </div>
    )
}

export default PerfilCard