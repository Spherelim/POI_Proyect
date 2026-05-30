import PerfilCard from "./PerfilCard";
import ChatCard from "./ChatCard"
import "./Sidebar.css"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"

import FotoDefault from "/src/assets/images/Conejito.jpg"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

function Sidebar({cambiarVista, abrirSolicitudes, seleccionarAmigo, actualizarSidebar, className, notificacionesNoLeidas, amigoActivo}){

    const usuario = JSON.parse(localStorage.getItem("usuario"))
    const [amigos, setAmigos] = useState([])
    const [grupos, setGrupos] = useState([])
    const [seccion, setSeccion] = useState("amigos") // 'amigos' o 'grupos'
    
    const formatearHora = (fechaSQL) => {
        if (!fechaSQL) return "";
        const fecha = new Date(fechaSQL);
        const hoy = new Date();
        const ayer = new Date(hoy);
        ayer.setDate(ayer.getDate() - 1);
        
        if (fecha.toDateString() === hoy.toDateString()) {
            return fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (fecha.toDateString() === ayer.toDateString()) {
            return "Ayer";
        } else {
            return fecha.toLocaleDateString([], { day: '2-digit', month: 'short' });
        }
    }
    
    // Estados para crear grupo
    const [mostrarModal, setMostrarModal] = useState(false)
    const [nombreGrupo, setNombreGrupo] = useState("")
    const [seleccionados, setSeleccionados] = useState([]) // IDs de amigos seleccionados

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
                            foto: fotoData.foto ? `${API_URL}${fotoData.foto}` : FotoDefault,
                            esFavorito: amigo.Favorito === 1
                        }
                    } catch (error) {
                        return { ...amigo, foto: FotoDefault, esFavorito: amigo.Favorito === 1 }
                    }
                })
            )
            
            setAmigos(amigosConFotos)
        } catch (error) {
            console.error("Error cargando amigos:", error)
        }
    }

    const cargarGrupos = async () => {
        try {
            const res = await fetch(`${API_URL}/grupos/${usuario.id}`)
            const data = await res.json()
            setGrupos(data)
        } catch (error) {
            console.error("Error cargando grupos:", error)
        }
    }

    useEffect(() => {
        cargarAmigos()
        cargarGrupos()
    }, [])

    useEffect(() => {
        if (actualizarSidebar) {
            cargarAmigos()
            cargarGrupos()
        }
    }, [actualizarSidebar])

    const handleSeleccionarAmigo = (amigo) => {
        seleccionarAmigo(amigo)
        cambiarVista("chat")
    }

    const handleSeleccionarGrupo = (grupo) => {
        seleccionarAmigo({
            ...grupo,
            esGrupo: true,
            ID_Us: null // Evitar colisión de IDs con amigos en otras partes
        })
        cambiarVista("chat")
    }

    const toggleSeleccionAmigo = (id) => {
        if (seleccionados.includes(id)) {
            setSeleccionados(seleccionados.filter(item => item !== id))
        } else {
            setSeleccionados([...seleccionados, id])
        }
    }

    const handleCrearGrupo = async (e) => {
        e.preventDefault()
        
        if (!nombreGrupo.trim()) {
            toast.warning("Por favor, ingresa un nombre para el grupo.")
            return
        }

        if (seleccionados.length < 2) {
            toast.warning("Debes seleccionar al menos 2 amigos para crear un grupo (mínimo 3 personas en total).")
            return
        }

        try {
            const res = await fetch(`${API_URL}/grupos/crear`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombreGrupo: nombreGrupo,
                    idCreador: usuario.id,
                    participantes: seleccionados
                })
            })

            const data = await res.json()

            if (res.ok) {
                toast.success("Grupo creado con éxito")
                setNombreGrupo("")
                setSeleccionados([])
                setMostrarModal(false)
                cargarGrupos()
            } else {
                toast.error(data.error || "Error al crear grupo")
            }
        } catch (error) {
            console.error("Error creando grupo:", error)
            toast.error("Error al conectar con el servidor.")
        }
    }

    return(
        <div className={`sidebar${className ? ' ' + className : ''}`}>
            <PerfilCard 
                cambiarVista={cambiarVista} 
                abrirSolicitudes={abrirSolicitudes}
                notificacionesNoLeidas={notificacionesNoLeidas}
            />

            {/* Selector de Sección */}
            <div className="sidebar-tabs">
                <button 
                    className={seccion === "amigos" ? "tab-active" : ""} 
                    onClick={() => setSeccion("amigos")}
                >
                    Chats
                </button>
                <button 
                    className={seccion === "grupos" ? "tab-active" : ""} 
                    onClick={() => setSeccion("grupos")}
                >
                    Grupos
                </button>
            </div>

            <input className="search" placeholder="Busca un chat..."/>

            {seccion === "amigos" ? (
                amigos.length === 0
                    ? <p style={{color:"rgba(255,255,255,0.5)", fontSize:"13px", textAlign:"center", marginTop:"20px"}}>
                        No tienes amigos aún
                    </p>
                    : amigos.map(amigo => (
                        <ChatCard
                            key={amigo.ID_Us}
                            imagen={amigo.foto}
                            NomUser={amigo.NombreUsuario}
                            ultmsg={amigo.unread_count > 0 ? `${amigo.unread_count} mensajes nuevos` : "Toca para chatear"}
                            time={formatearHora(amigo.last_msg_date)}
                            esFavorito={amigo.esFavorito}
                            abrirChat={() => handleSeleccionarAmigo(amigo)}
                            unreadCount={amigo.unread_count || 0}
                            activo={amigoActivo && !amigoActivo.esGrupo && amigoActivo.ID_Us === amigo.ID_Us}
                        />
                    ))
            ) : (
                <div className="grupos-section">
                    <button className="btn-crear-grupo" onClick={() => setMostrarModal(true)}>
                        + Crear Grupo (Min. 3)
                    </button>
                    
                    {grupos.length === 0
                        ? <p style={{color:"rgba(255,255,255,0.5)", fontSize:"13px", textAlign:"center", marginTop:"20px"}}>
                            No estás en ningún grupo aún
                        </p>
                        : grupos.map(grupo => (
                            <ChatCard
                                key={grupo.ID_Conversacion}
                                imagen={grupo.fotoGrupo ? `${API_URL}${grupo.fotoGrupo}` : FotoDefault}
                                NomUser={grupo.nombreGrupo}
                                ultmsg={grupo.unread_count > 0 ? "Nuevos mensajes" : (grupo.rol === 'admin' ? "Administrador" : "Miembro")}
                                time={formatearHora(grupo.last_msg_date)}
                                esFavorito={false}
                                abrirChat={() => handleSeleccionarGrupo(grupo)}
                                unreadCount={grupo.unread_count || 0}
                                activo={amigoActivo && amigoActivo.esGrupo && amigoActivo.ID_Conversacion === grupo.ID_Conversacion}
                            />
                        ))
                    }
                </div>
            )}

            {/* Modal de Creación de Grupo */}
            {mostrarModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Crear Chat Grupal</h3>
                        <form onSubmit={handleCrearGrupo}>
                            <div className="form-group">
                                <label>Nombre del Grupo</label>
                                <input 
                                    type="text" 
                                    placeholder="Nombre del grupo..." 
                                    value={nombreGrupo} 
                                    onChange={(e) => setNombreGrupo(e.target.value)} 
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label>Selecciona al menos 2 amigos:</label>
                                <div className="lista-amigos-seleccion">
                                    {amigos.length === 0 ? (
                                        <p style={{color: "rgba(255,255,255,0.5)", fontSize: "12px"}}>Agrega amigos antes de crear un grupo.</p>
                                    ) : (
                                        amigos.map(amigo => (
                                            <div 
                                                key={amigo.ID_Us} 
                                                className={`amigo-seleccion-item ${seleccionados.includes(amigo.ID_Us) ? "seleccionado" : ""}`}
                                                onClick={() => toggleSeleccionAmigo(amigo.ID_Us)}
                                            >
                                                <img src={amigo.foto} alt={amigo.NombreUsuario} />
                                                <span>{amigo.NombreUsuario}</span>
                                                <input 
                                                    type="checkbox" 
                                                    checked={seleccionados.includes(amigo.ID_Us)}
                                                    onChange={() => {}} // Controlado por el click div
                                                />
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancelar" onClick={() => setMostrarModal(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-crear">
                                    Crear Grupo
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Sidebar;