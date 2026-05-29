import "./UserPerfil.css"
import Alert from "../Alert"
import { useState, useEffect } from "react"

import FotoDefault from "/src/assets/images/Conejito.jpg"
import BannerDefault from "/src/assets/images/Banner 3.png"

import FavoritoIcon from "/src/assets/icons/corazon (w).png"
import FavoritoIconFilled from "/src/assets/icons/corazon (w1).png"

import EliminarIcon from "/src/assets/icons/Contactos/eliminar-usuario (w).png"

import BloquearIcon from "/src/assets/icons/prohibicion (w).png"

import SilenciarIcon from "/src/assets/icons/Notificación/campana 1 (w).png"
import SilenciarIconFilled from "/src/assets/icons/Notificación/corte-de-campana 1 (w).png"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

function UserPerfil({ amigo, usuarioActualId }){
    const [AlertData, setMostrarAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const [alertAction, setAlertAction] = useState(null)
    const [userData, setUserData] = useState({
        foto: FotoDefault,
        banner: BannerDefault,
        nombreUsuario: "Cargando...",
        nombreCompleto: "",
        descripcion: "",
        fechaIngreso: "",
        puntos: 0
    })
    
    // Estados de la amistad
    const [esFavorito, setEsFavorito] = useState(false)
    const [estaSilenciado, setEstaSilenciado] = useState(false)
    const [cargandoEstado, setCargandoEstado] = useState(true)

    useEffect(() => {
        if (amigo && amigo.ID_Us) {
            // Obtener datos completos del usuario
            fetch(`${API_URL}/usuarios/detalles/${amigo.ID_Us}`)
                .then(res => res.json())
                .then(data => {
                    setUserData({
                        foto: data.Foto ? `${API_URL}${data.Foto}` : FotoDefault,
                        banner: data.Banner ? `${API_URL}${data.Banner}` : BannerDefault,
                        nombreUsuario: data.NombreUsuario,
                        nombreCompleto: data.NombreCompleto || "",
                        descripcion: data.Descripcion || "",
                        fechaIngreso: formatearFecha(data.FechaIngreso),
                        puntos: data.Puntos || 0
                    })
                })
                .catch(err => console.error("Error al obtener datos del usuario:", err))
            
            // Obtener estado de la amistad
            cargarEstadoAmistad()
        }
    }, [amigo])

    const cargarEstadoAmistad = async () => {
        if (!amigo?.ID_Us || !usuarioActualId) return
        
        try {
            const res = await fetch(`${API_URL}/amistad/estado/${usuarioActualId}/${amigo.ID_Us}`)
            const data = await res.json()
            setEsFavorito(data.favorito === 1)
            setEstaSilenciado(data.silenciado === 1)
        } catch (error) {
            console.error("Error cargando estado:", error)
        } finally {
            setCargandoEstado(false)
        }
    }

    const formatearFecha = (fecha) => {
        if (!fecha) return "Fecha no disponible"
        const date = new Date(fecha)
        return date.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })
    }

    const handleFavorito = async () => {
        const nuevoEstado = !esFavorito
        setEsFavorito(nuevoEstado)
        
        try {
            await fetch(`${API_URL}/amistad/favorito`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    idUsuario: usuarioActualId, 
                    idAmigo: amigo.ID_Us, 
                    favorito: nuevoEstado 
                })
            })

            console.log(`Amigo ${nuevoEstado ? "marcado como favorito" : "removido de favoritos"}`)
        } catch (error) {
            console.error("Error:", error)
            setEsFavorito(!nuevoEstado)
        }
    }

    const handleSilenciar = async () => {
        const nuevoEstado = !estaSilenciado
        setEstaSilenciado(nuevoEstado)
        
        try {
            await fetch(`${API_URL}/amistad/silenciar`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    idUsuario: usuarioActualId, 
                    idAmigo: amigo.ID_Us, 
                    silenciado: nuevoEstado 
                })
            })
        } catch (error) {
            console.error("Error:", error)
            setEstaSilenciado(!nuevoEstado)
        }
    }

    const handleAccion = (accion) => {
        if (accion === "favorito") {
            handleFavorito()
        } else if (accion === "silenciar") {
            handleSilenciar()
        } else {
            setAlertMessage(`¿Estás seguro de que quieres ${accion} a ${userData.nombreUsuario}?`)
            setAlertAction(accion)
            setMostrarAlert(true)
        }
    }

    const confirmarAccion = async () => {
        try{

            let res;
            
            if (alertAction === "eliminar de amigos") {
                // Llamar a endpoint para eliminar amigo
                res = await fetch(`${API_URL}/amistad/eliminar`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ idUsuario: usuarioActualId, idAmigo: amigo.ID_Us })
                })

                if(res.ok){
                    // Recargar sidebar
                    window.dispatchEvent(new Event('storage'))
                    window.location.reload()
                }

            } else if (alertAction === "bloquear") {
                // Llamar a endpoint para bloquear
                res = await fetch(`${API_URL}/amistad/bloquear`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ idUsuario: usuarioActualId, idAmigo: amigo.ID_Us })
                })

                if(res.ok){
                    // Recargar sidebar
                    window.dispatchEvent(new Event('storage'))
                    window.location.reload()
                }

            }
            setMostrarAlert(false)
            setAlertAction(null)
            // Recargar sidebar
            // window.dispatchEvent(new Event('storage'))
        }
        catch(error){
            console.error("Error en acción:", error)
            setMostrarAlert(false)
            setAlertAction(null)
        }
    }

    if (cargandoEstado) {
        return <div className="Perfil-User">Cargando...</div>
    }

    return(
        <>
            <div className="Perfil-User">
                <img 
                    className="banner" 
                    src={userData.banner} 
                    alt="Banner" 
                    onError={(e) => {
                        e.target.src = BannerDefault
                    }}
                />
                <img 
                    className="avatar" 
                    src={userData.foto} 
                    alt="Foto Perfil"
                    onError={(e) => {
                        e.target.src = FotoDefault
                    }}
                />

                <div className="acciones">
                    <div className="accionesUno">
                        <img 
                            src={esFavorito ? FavoritoIconFilled : FavoritoIcon} 
                            alt="Favorito" 
                            className="Favorito" 
                            onClick={() => handleAccion("favorito")}
                        />
                        <img 
                            src={EliminarIcon} 
                            alt="Eliminar Usuario" 
                            className="Eliminar"
                            onClick={() => handleAccion("eliminar de amigos")}
                        />
                    </div>

                    <div className="accionesDos">
                        <img 
                            src={BloquearIcon} 
                            alt="Bloquear Usuario" 
                            className="Bloquear"
                            onClick={() => handleAccion("bloquear")}
                        />
                        <img 
                            src={estaSilenciado ? SilenciarIconFilled : SilenciarIcon} 
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
                    onConfirm={confirmarAccion}
                />
            )}
        </>
    )
}

export default UserPerfil