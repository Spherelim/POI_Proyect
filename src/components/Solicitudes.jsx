import "./Solicitudes.css"
import { useState, useEffect } from "react"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

function Solicitudes({cerrar}){
    const usuario = JSON.parse(localStorage.getItem("usuario"))
    const [tab, setTab] = useState("buscar")
    const [busqueda, setBusqueda] = useState("")
    const [resultados, setResultados] = useState([])
    const [solicitudes, setSolicitudes] = useState([])

    useEffect(() => {
        fetch(`${API_URL}/solicitudes/${usuario.id}`)
            .then(r => r.json())
            .then(data => setSolicitudes(data))
    }, [])

    useEffect(() => {
        if (!busqueda.trim()) {
            setResultados([])
            return
        }
        const timeout = setTimeout(async () => {
            const res = await fetch(`${API_URL}/usuarios/buscar?q=${busqueda}&idUsuario=${usuario.id}`)
            const data = await res.json()
            setResultados(data)
        }, 300)
        return () => clearTimeout(timeout)
    }, [busqueda])

    const enviarSolicitud = async (idReceptor) => {
        await fetch(`${API_URL}/solicitud/enviar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idEmisor: usuario.id, idReceptor })
        })
        const res = await fetch(`${API_URL}/usuarios/buscar?q=${busqueda}&idUsuario=${usuario.id}`)
        const data = await res.json()
        setResultados(data)
    }

    const responder = async (idAmistad, accion) => {
        await fetch(`${API_URL}/solicitud/responder`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idAmistad, accion })
        })
        setSolicitudes(prev => prev.filter(s => s.ID_Amistad !== idAmistad))
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
                                    <div className="avatar-placeholder"/>
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
                                        <div className="avatar-placeholder"/>
                                        <span>{s.NombreUsuario}</span>
                                        <button className="btn-aceptar" onClick={() => responder(s.ID_Amistad, "aceptado")}>✓ Aceptar</button>
                                        <button className="btn-rechazar" onClick={() => responder(s.ID_Amistad, "rechazado")}>✕ Rechazar</button>
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