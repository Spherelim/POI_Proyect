import "./Solicitudes.css"
import { useState, useEffect } from "react"

import FotoDefault from "/src/assets/images/Conejito.jpg"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

function Solicitudes({cerrar, onAmigoActualizado}){
    const usuario = JSON.parse(localStorage.getItem("usuario"))
    const [tab, setTab] = useState("buscar")
    const [busqueda, setBusqueda] = useState("")
    const [resultados, setResultados] = useState([])
    const [solicitudes, setSolicitudes] = useState([])
    const [bloqueados, setBloqueados] = useState([])

    useEffect(() => {
        cargarSolicitudes()
        cargarBloqueados()
    }, [])

    const cargarSolicitudes = async () => {
        const res = await fetch(`${API_URL}/solicitudes/${usuario.id}`)
        const data = await res.json()
        
        // Cargar fotos de los usuarios que enviaron solicitudes
        const solicitudesConFotos = await Promise.all(
            data.map(async (solicitud) => {
                try {
                    const fotoRes = await fetch(`${API_URL}/usuarios/${solicitud.ID_Us}/foto`)
                    const fotoData = await fotoRes.json()
                    return {
                        ...solicitud,
                        foto: fotoData.foto ? `${API_URL}${fotoData.foto}` : FotoDefault
                    }
                } catch (error) {
                    return { ...solicitud, foto: FotoDefault }
                }
            })
        )
        setSolicitudes(solicitudesConFotos)
    }

    const cargarBloqueados = async () => {
        const res = await fetch(`${API_URL}/bloqueados/${usuario.id}`)
        const data = await res.json()
        const bloqueadosConFotos = await Promise.all(
            data.map(async (user) => {
                try {
                    const fotoRes = await fetch(`${API_URL}/usuarios/${user.ID_Us}/foto`)
                    const fotoData = await fotoRes.json()
                    return { ...user, foto: fotoData.foto ? `${API_URL}${fotoData.foto}` : FotoDefault }
                } catch { return { ...user, foto: FotoDefault } }
            })
        )
        setBloqueados(bloqueadosConFotos)
    }

    const desbloquear = async (idAmigo) => {
        await fetch(`${API_URL}/amistad/desbloquear`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idUsuario: usuario.id, idAmigo })
        })
        // Recargar lista de bloqueados y amigos
        cargarBloqueados()
        if (onAmigoActualizado) onAmigoActualizado()
    }

    const fetchUsuarios = async (query) => {
        const res = await fetch(`${API_URL}/usuarios/buscar?q=${encodeURIComponent(query)}&idUsuario=${usuario.id}`)
        const data = await res.json()
        const conFotos = await Promise.all(
            data.map(async (user) => {
                try {
                    const fotoRes = await fetch(`${API_URL}/usuarios/${user.ID_Us}/foto`)
                    const fotoData = await fotoRes.json()
                    return { ...user, foto: fotoData.foto ? `${API_URL}${fotoData.foto}` : FotoDefault }
                } catch {
                    return { ...user, foto: FotoDefault }
                }
            })
        )
        setResultados(conFotos)
    }

    // Cargar todos los usuarios al montar el tab de buscar
    useEffect(() => {
        fetchUsuarios("")
    }, [])

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchUsuarios(busqueda.trim())
        }, 300)
        return () => clearTimeout(timeout)
    }, [busqueda])

    const enviarSolicitud = async (idReceptor) => {
        await fetch(`${API_URL}/solicitud/enviar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idEmisor: usuario.id, idReceptor })
        })
        fetchUsuarios(busqueda.trim())
    }

    const responder = async (idAmistad, accion) => {
        await fetch(`${API_URL}/solicitud/responder`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idAmistad, accion })
        })
        setSolicitudes(prev => prev.filter(s => s.ID_Amistad !== idAmistad))
        
        if (accion === "aceptado" && onAmigoActualizado) {
            onAmigoActualizado()
        }
    }

    // Componente para mostrar avatar con foto
    const Avatar = ({ foto, nombre }) => {
        // Si hay foto, intenta mostrarla
        if (foto) {
            return (
                <img 
                    src={foto} 
                    alt={nombre}
                    className="avatar-img"
                    onError={(e) => {
                        // Si falla, muestra la inicial
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                    }}
                />
            )
        }
        
        return (
            <div className="avatar-inicial">
                {nombre?.charAt(0).toUpperCase() || "?"}
            </div>
        )
    }

    return(
        <div className="modal-overlay" onClick={cerrar}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>

                <div className="modal-header">
                    <div className="modal-tabs">
                        <button
                            className={tab === "buscar" ? "tab activo" : "tab"}
                            onClick={() => setTab("buscar")}>
                            Agregar amigo
                        </button>
                        <button
                            className={tab === "solicitudes" ? "tab activo" : "tab"}
                            onClick={() => setTab("solicitudes")}>
                            Solicitudes
                            {solicitudes.length > 0 && (
                                <span className="badge">{solicitudes.length}</span>
                            )}
                        </button>
                        <button
                            className={tab === "bloqueados" ? "tab activo" : "tab"}
                            onClick={() => setTab("bloqueados")}>
                            Bloqueados
                            {bloqueados.length > 0 && <span className="badge">{bloqueados.length}</span>}
                        </button>
                    </div>
                    <button className="modal-cerrar" onClick={cerrar}>✕</button>
                </div>

                <div className="modal-body">
                    {tab === "buscar" && (
                        <>
                            <div className="buscar-row">
                                <input
                                    placeholder="Buscar usuario..."
                                    value={busqueda}
                                    onChange={e => setBusqueda(e.target.value)}
                                />
                            </div>
                            {busqueda && resultados.length === 0 && (
                                <p className="vacio">No se encontraron usuarios</p>
                            )}
                            {resultados.map(u => (
                                <div className="usuario-item" key={u.ID_Us}>
                                    <Avatar foto={u.foto} nombre={u.NombreUsuario} />
                                    <div className="avatar-inicial" style={{display: 'none'}}>
                                        {u.NombreUsuario?.charAt(0).toUpperCase() || "?"}
                                    </div>
                                    <span>{u.NombreUsuario}</span>
                                    {u.estadoAmistad === "aceptado" && (
                                        <span className="estado-tag amigos">✓ Amigos</span>
                                    )}
                                    {u.estadoAmistad === "pendiente" && (
                                        <span className="estado-tag pendiente">⏳ Pendiente</span>
                                    )}
                                    {!u.estadoAmistad && (
                                        <button onClick={() => enviarSolicitud(u.ID_Us)}>Agregar</button>
                                    )}
                                </div>
                            ))}
                        </>
                    )}

                    {tab === "solicitudes" && (
                        <>
                            {solicitudes.length === 0
                                ? <p className="vacio">No tienes solicitudes pendientes</p>
                                : solicitudes.map(s => (
                                    <div className="usuario-item" key={s.ID_Amistad}>
                                        <Avatar foto={s.foto} nombre={s.NombreUsuario} />
                                        <span>{s.NombreUsuario}</span>
                                        <button className="btn-aceptar" onClick={() => responder(s.ID_Amistad, "aceptado")}>✓ Aceptar</button>
                                        <button className="btn-rechazar" onClick={() => responder(s.ID_Amistad, "rechazado")}>✕ Rechazar</button>
                                    </div>
                                ))
                            }
                        </>
                    )}

                    {tab === "bloqueados" && (
                        <>
                            {bloqueados.length === 0
                                ? <p className="vacio">No tienes usuarios bloqueados</p>
                                : bloqueados.map(u => (
                                    <div className="usuario-item" key={u.ID_Us}>
                                        <Avatar foto={u.foto} nombre={u.NombreUsuario} />
                                        <span>{u.NombreUsuario}</span>
                                        <button className="btn-desbloquear" onClick={() => desbloquear(u.ID_Us)}>Desbloquear</button>
                                    </div>
                                ))
                            }
                        </>
                    )}

                </div>

            </div>
        </div>
    )
}

export default Solicitudes