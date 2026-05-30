import "./GroupPerfil.css"
import Alert from "../Alert"
import { useState, useEffect, useRef } from "react"
import { toast } from "react-toastify"

import FotoDefault from "/src/assets/images/Conejito.jpg"
import BannerDefault from "/src/assets/images/Banner 3.png"
import EliminarIcon from "/src/assets/icons/Contactos/eliminar-usuario (w).png"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

function GroupPerfil({ grupo, usuarioActualId, alSalirGrupo }){
    const [AlertData, setMostrarAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const [alertAction, setAlertAction] = useState(null)
    const [actionData, setActionData] = useState(null)
    
    const [detalles, setDetalles] = useState(null)
    const [miembros, setMiembros] = useState([])
    const [amigosNoMiembros, setAmigosNoMiembros] = useState([])
    const [cargando, setCargando] = useState(true)
    const [mostrarAgregarMiembro, setMostrarAgregarMiembro] = useState(false)
    const [amigoSeleccionado, setAmigoSeleccionado] = useState("")

    // Estado de edición del grupo
    const [modoEdicion, setModoEdicion] = useState(false)
    const [nombreEditado, setNombreEditado] = useState("")
    const [previewFoto, setPreviewFoto] = useState(null)
    const [previewBanner, setPreviewBanner] = useState(null)
    const [fotoFile, setFotoFile] = useState(null)
    const [bannerFile, setBannerFile] = useState(null)
    const [guardando, setGuardando] = useState(false)

    const fotoInputRef = useRef(null)
    const bannerInputRef = useRef(null)

    const idConversacion = grupo.ID_Conversacion;

    useEffect(() => {
        cargarDetallesGrupo()
    }, [idConversacion])

    const cargarDetallesGrupo = async () => {
        setCargando(true)
        try {
            const res = await fetch(`${API_URL}/grupos/detalles/${idConversacion}`)
            const data = await res.json()
            if (data.grupo) {
                setDetalles(data.grupo)
                setMiembros(data.miembros || [])
                cargarAmigosParaAgregar(data.miembros || [])
            }
        } catch (error) {
            console.error("Error al cargar detalles del grupo:", error)
        } finally {
            setCargando(false)
        }
    }

    const cargarAmigosParaAgregar = async (miembrosActuales) => {
        try {
            const res = await fetch(`${API_URL}/amigos/${usuarioActualId}`)
            const amigos = await res.json()
            const miembrosIds = miembrosActuales.map(m => m.ID_Us)
            const filtrados = amigos.filter(a => !miembrosIds.includes(a.ID_Us))
            setAmigosNoMiembros(filtrados)
            if (filtrados.length > 0) {
                setAmigoSeleccionado(filtrados[0].ID_Us.toString())
            }
        } catch (error) {
            console.error("Error al cargar amigos:", error)
        }
    }

    const handleAgregarMiembro = async () => {
        if (!amigoSeleccionado) return
        try {
            const res = await fetch(`${API_URL}/grupos/miembros/agregar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idConversacion,
                    idEjecutor: usuarioActualId,
                    idNuevoMiembro: parseInt(amigoSeleccionado)
                })
            })
            const data = await res.json()
            if (res.ok) {
                setMostrarAgregarMiembro(false)
                cargarDetallesGrupo()
                toast.success("Miembro agregado con éxito")
            } else {
                toast.error(data.error || "Error al agregar miembro")
            }
        } catch (error) {
            console.error("Error agregando miembro:", error)
            toast.error("Error al conectar con el servidor.")
        }
    }

    const handleConfirmarAccion = (accion, message, targetData) => {
        setAlertMessage(message)
        setAlertAction(accion)
        setActionData(targetData)
        setMostrarAlert(true)
    }

    const confirmarAccion = async () => {
        try {
            let res;
            if (alertAction === "eliminar") {
                res = await fetch(`${API_URL}/grupos/miembros/eliminar`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        idConversacion,
                        idEjecutor: usuarioActualId,
                        idMiembroEliminar: actionData
                    })
                })
            } else if (alertAction === "salir") {
                res = await fetch(`${API_URL}/grupos/salir`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        idConversacion,
                        idUsuario: usuarioActualId
                    })
                })
                if (res.ok && alSalirGrupo) {
                    alSalirGrupo()
                }
            } else if (alertAction === "rol_admin" || alertAction === "rol_miembro") {
                const nuevoRol = alertAction === "rol_admin" ? "admin" : "miembro"
                res = await fetch(`${API_URL}/grupos/roles/cambiar`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        idConversacion,
                        idEjecutor: usuarioActualId,
                        idMiembro: actionData,
                        nuevoRol
                    })
                })
            }

            if (res && res.ok) {
                setMostrarAlert(false)
                setActionData(null)
                if (alertAction !== "salir") {
                    cargarDetallesGrupo()
                }
            } else {
                const data = await res.json()
                alert(data.error || "Error al realizar acción")
                setMostrarAlert(false)
            }
        } catch (error) {
            console.error("Error procesando acción:", error)
            setMostrarAlert(false)
        }
    }

    // ── Edición del grupo ──────────────────────────────────────────
    const iniciarEdicion = () => {
        setNombreEditado(detalles.nombreGrupo || "")
        setPreviewFoto(null)
        setPreviewBanner(null)
        setFotoFile(null)
        setBannerFile(null)
        setModoEdicion(true)
    }

    const cancelarEdicion = () => {
        setModoEdicion(false)
        setPreviewFoto(null)
        setPreviewBanner(null)
        setFotoFile(null)
        setBannerFile(null)
    }

    const handleFotoChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setFotoFile(file)
        setPreviewFoto(URL.createObjectURL(file))
    }

    const handleBannerChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setBannerFile(file)
        setPreviewBanner(URL.createObjectURL(file))
    }

    const guardarCambios = async () => {
        if (!nombreEditado.trim() && !fotoFile && !bannerFile) {
            alert("No has modificado nada.")
            return
        }
        setGuardando(true)
        try {
            const formData = new FormData()
            formData.append("idEjecutor", usuarioActualId)
            if (nombreEditado.trim()) formData.append("nombreGrupo", nombreEditado.trim())
            if (fotoFile) formData.append("fotoGrupo", fotoFile)
            if (bannerFile) formData.append("fotoBanner", bannerFile)

            const res = await fetch(`${API_URL}/grupos/editar/${idConversacion}`, {
                method: "PUT",
                body: formData
            })
            const data = await res.json()
            if (res.ok) {
                setDetalles(prev => ({ ...prev, ...data.grupo }))
                cancelarEdicion()
            } else {
                alert(data.error || "Error al guardar cambios")
            }
        } catch (error) {
            console.error("Error guardando cambios:", error)
            alert("Error al conectar con el servidor.")
        } finally {
            setGuardando(false)
        }
    }
    // ──────────────────────────────────────────────────────────────

    if (cargando) {
        return <div className="Perfil-Grupo">Cargando detalles del grupo...</div>
    }

    if (!detalles) {
        return <div className="Perfil-Grupo">No se pudo cargar la información.</div>
    }

    const creadorId = detalles.idCreador
    const soyCreador = usuarioActualId === creadorId
    const miFila = miembros.find(m => m.ID_Us === usuarioActualId)
    const soyAdmin = soyCreador || (miFila && miFila.rol === 'admin')

    const fotoGrupo = previewFoto || (detalles.fotoGrupo ? `${API_URL}${detalles.fotoGrupo}` : FotoDefault)
    const bannerGrupo = previewBanner || (detalles.fotoBanner ? `${API_URL}${detalles.fotoBanner}` : BannerDefault)

    return (
        <>
            <div className="Perfil-Grupo">

                {/* Banner */}
                <div className="banner-wrapper">
                    <img className="banner-g" src={bannerGrupo} alt="Banner" />
                    {modoEdicion && (
                        <>
                            <button className="btn-cambiar-banner" onClick={() => bannerInputRef.current?.click()}>
                                📷 Cambiar banner
                            </button>
                            <input
                                ref={bannerInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleBannerChange}
                            />
                        </>
                    )}
                </div>

                {/* Avatar */}
                <div className="avatar-wrapper">
                    <img
                        className="avatar-g"
                        src={fotoGrupo}
                        alt="Foto Grupo"
                        onError={(e) => { e.target.src = FotoDefault }}
                        onClick={modoEdicion ? () => fotoInputRef.current?.click() : undefined}
                        style={modoEdicion ? { cursor: "pointer" } : {}}
                        title={modoEdicion ? "Clic para cambiar foto" : ""}
                    />
                    {modoEdicion && (
                        <>
                            <div className="avatar-edit-hint" onClick={() => fotoInputRef.current?.click()}>✏️</div>
                            <input
                                ref={fotoInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleFotoChange}
                            />
                        </>
                    )}
                </div>

                {/* Nombre del grupo */}
                {modoEdicion ? (
                    <input
                        className="input-nombre-grupo"
                        value={nombreEditado}
                        onChange={(e) => setNombreEditado(e.target.value)}
                        placeholder="Nombre del grupo..."
                        maxLength={100}
                    />
                ) : (
                    <p className="NombreGrupoText">{detalles.nombreGrupo}</p>
                )}
                <p className="DescripGrupo">Grupo • {miembros.length} integrantes</p>

                {/* Botones de edición — solo admins */}
                {soyAdmin && (
                    <div className="edit-group-actions">
                        {modoEdicion ? (
                            <>
                                <button className="btn-guardar-grupo" onClick={guardarCambios} disabled={guardando}>
                                    {guardando ? "Guardando..." : "✓ Guardar cambios"}
                                </button>
                                <button className="btn-cancelar-edicion" onClick={cancelarEdicion} disabled={guardando}>
                                    Cancelar
                                </button>
                            </>
                        ) : (
                            <button className="btn-editar-grupo" onClick={iniciarEdicion}>
                                ✏️ Editar grupo
                            </button>
                        )}
                    </div>
                )}

                {/* Agregar miembro (solo admins) */}
                {soyAdmin && !modoEdicion && (
                    <div className="admin-actions">
                        <button className="btn-add-member" onClick={() => setMostrarAgregarMiembro(!mostrarAgregarMiembro)}>
                            {mostrarAgregarMiembro ? "Cancelar" : "+ Agregar Miembro"}
                        </button>
                    </div>
                )}

                {mostrarAgregarMiembro && (
                    <div className="agregar-miembro-panel">
                        {amigosNoMiembros.length === 0 ? (
                            <p style={{color: "rgba(255,255,255,0.6)", fontSize: "13px"}}>No tienes más amigos para agregar.</p>
                        ) : (
                            <div className="form-agregar">
                                <select
                                    value={amigoSeleccionado}
                                    onChange={(e) => setAmigoSeleccionado(e.target.value)}
                                    className="select-amigo"
                                >
                                    {amigosNoMiembros.map(a => (
                                        <option key={a.ID_Us} value={a.ID_Us}>
                                            {a.NombreUsuario}
                                        </option>
                                    ))}
                                </select>
                                <button className="btn-confirm-add" onClick={handleAgregarMiembro}>Agregar</button>
                            </div>
                        )}
                    </div>
                )}

                {/* Lista de miembros */}
                <div className="miembros-section">
                    <h4>Miembros del grupo</h4>
                    <div className="miembros-lista">
                        {miembros.map((m) => {
                            const esMiembroCreador = m.ID_Us === creadorId
                            const esMiembroAdmin = m.rol === 'admin'
                            const fotoMiembro = m.Foto ? `${API_URL}${m.Foto}` : FotoDefault

                            return (
                                <div key={m.ID_Us} className="miembro-card">
                                    <img
                                        src={fotoMiembro}
                                        alt={m.NombreUsuario}
                                        onError={(e) => { e.target.src = FotoDefault }}
                                    />
                                    <div className="miembro-info">
                                        <p>{m.NombreUsuario} {m.ID_Us === usuarioActualId && "(Tú)"}</p>
                                        <span className="miembro-tag">
                                            {esMiembroCreador ? "Creador principal" : (esMiembroAdmin ? "Administrador" : "Miembro")}
                                        </span>
                                    </div>
                                    <div className="miembro-acciones">
                                        {/* Acciones del creador principal */}
                                        {soyCreador && m.ID_Us !== usuarioActualId && (
                                            <>
                                                <button
                                                    className="btn-rol"
                                                    onClick={() => handleConfirmarAccion(
                                                        esMiembroAdmin ? "rol_miembro" : "rol_admin",
                                                        `¿Quieres cambiar el rol de ${m.NombreUsuario} a ${esMiembroAdmin ? 'Miembro' : 'Administrador'}?`,
                                                        m.ID_Us
                                                    )}
                                                >
                                                    {esMiembroAdmin ? "Quitar Admin" : "Hacer Admin"}
                                                </button>
                                                <button
                                                    className="btn-delete"
                                                    onClick={() => handleConfirmarAccion(
                                                        "eliminar",
                                                        `¿Estás seguro de que quieres eliminar a ${m.NombreUsuario} del grupo?`,
                                                        m.ID_Us
                                                    )}
                                                >
                                                    Eliminar
                                                </button>
                                            </>
                                        )}
                                        {/* Acciones de admins regulares */}
                                        {soyAdmin && !soyCreador && !esMiembroAdmin && !esMiembroCreador && m.ID_Us !== usuarioActualId && (
                                            <button
                                                className="btn-delete"
                                                onClick={() => handleConfirmarAccion(
                                                    "eliminar",
                                                    `¿Estás seguro de que quieres eliminar a ${m.NombreUsuario} del grupo?`,
                                                    m.ID_Us
                                                )}
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {!soyCreador && (
                    <button
                        className="btn-salir-grupo"
                        onClick={() => handleConfirmarAccion("salir", "¿Estás seguro de que quieres salir de este grupo?", usuarioActualId)}
                    >
                        Salir del grupo
                    </button>
                )}
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

export default GroupPerfil;
