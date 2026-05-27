import "./UserPerfil.css"
import Alert from "../Alert"
import { useState, useEffect } from "react"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

function UserPerfil({ amigo }){
    const [AlertData, setMostrarAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const [userData, setUserData] = useState({
        foto: "/src/assets/images/default-avatar.png",
        banner: "/src/assets/images/default-banner.png",
        nombreUsuario: "Cargando...",
        nombreCompleto: "",
        fechaIngreso: "",
        puntos: 0
    })

    useEffect(() => {
        if (amigo && amigo.ID_Us) {
            // Obtener datos completos del usuario
            fetch(`${API_URL}/usuarios/detalles/${amigo.ID_Us}`)
                .then(res => res.json())
                .then(data => {
                    setUserData({
                        foto: data.Foto ? `${API_URL}${data.Foto}` : "/src/assets/images/default-avatar.png",
                        banner: data.Banner ? `${API_URL}${data.Banner}` : "/src/assets/images/default-banner.png",
                        nombreUsuario: data.NombreUsuario,
                        nombreCompleto: data.NombreCompleto || "",
                        descripcion: data.Descripcion || "", // Agrega esta línea
                        fechaIngreso: formatearFecha(data.FechaIngreso),
                        puntos: data.Puntos || 0
                    })
                })
                .catch(err => console.error("Error al obtener datos del usuario:", err))
        }
    }, [amigo])

    const formatearFecha = (fecha) => {
        if (!fecha) return "Fecha no disponible"
        const date = new Date(fecha)
        return date.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })
    }

    const handleAccion = (accion) => {
        setAlertMessage(`¿Estás seguro de que quieres ${accion} a ${userData.nombreUsuario}?`)
        setMostrarAlert(true)
    }

    let favorito = "/src/assets/icons/corazon (w).png"
    let eliminar = "/src/assets/icons/Contactos/eliminar-usuario (w).png"
    let bloquear = "/src/assets/icons/prohibicion (w).png"
    let sileciar = "/src/assets/icons/Notificación/campana 1 (w).png"

    return(
        <>
            <div className="Perfil-User">
                <img 
                    className="banner" 
                    src={userData.banner} 
                    alt="Banner" 
                    onError={(e) => {
                        e.target.src = "/src/assets/images/default-banner.png"
                    }}
                />
                <img 
                    className="avatar" 
                    src={userData.foto} 
                    alt="Foto Perfil"
                    onError={(e) => {
                        e.target.src = "/src/assets/images/default-avatar.png"
                    }}
                />

                <div className="acciones">
                    <div className="accionesUno">
                        <img 
                            src={favorito} 
                            alt="Favorito" 
                            className="Favorito" 
                            onClick={() => handleAccion("marcar como favorito")}
                        />
                        <img 
                            src={eliminar} 
                            alt="Eliminar Usuario" 
                            className="Eliminar"
                            onClick={() => handleAccion("eliminar de amigos")}
                        />
                    </div>

                    <div className="accionesDos">
                        <img 
                            src={bloquear} 
                            alt="Bloquear Usuario" 
                            className="Bloquear"
                            onClick={() => handleAccion("bloquear")}
                        />
                        <img 
                            src={sileciar} 
                            alt="Silenciar Usuario" 
                            className="Silenciar"
                            onClick={() => handleAccion("silenciar")}
                        />
                    </div>
                </div>                

                <p className="NombreUs">{userData.nombreUsuario}</p>
                <p className="Descrip">{userData.nombreCompleto}</p>
                <p className="Descripcion">{userData.descripcion}</p>

                <div className="Stats">
                    <div className="Stat">
                        <span className="StatValue">{userData.puntos}</span>
                        <span className="StatLabel">Puntos</span>
                    </div>
                </div>

                <div className="Fecha">
                    <p className="FechaIngreso">Se unió el {userData.fechaIngreso}</p>
                </div>
            </div>

            {AlertData && (
                <Alert
                    Titulo="Confirmar Acción"
                    mensaje={alertMessage}
                    cerrar={() => setMostrarAlert(false)}
                    onConfirm={() => {
                        // Aquí iría la lógica para cada acción
                        console.log("Acción confirmada")
                        setMostrarAlert(false)
                    }}
                />
            )}
        </>
    )
}

export default UserPerfil