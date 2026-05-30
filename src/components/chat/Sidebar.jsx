import PerfilCard from "./PerfilCard";
import ChatCard from "./ChatCard"
import "./Sidebar.css"
import { useState, useEffect } from "react"

import FotoDefault from "/src/assets/images/Conejito.jpg"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

function Sidebar({cambiarVista, abrirSolicitudes, seleccionarAmigo, actualizarSidebar}){

    const usuario = JSON.parse(localStorage.getItem("usuario"))
    const [amigos, setAmigos] = useState([])
    const [grupos, setGrupos] = useState([])
    const [seccion, setSeccion] = useState("amigos") // 'amigos' o 'grupos'
    
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
            alert("Por favor, ingresa un nombre para el grupo.")
            return
        }

        if (seleccionados.length < 2) {
            alert("Debes seleccionar al menos 2 amigos para crear un grupo (mínimo 3 personas en total).")
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
                alert("Grupo creado con éxito")
                setNombreGrupo("")
                setSeleccionados([])
                setMostrarModal(false)
                cargarGrupos()
            } else {
                alert(data.error || "Error al crear grupo")
            }
        } catch (error) {
            console.error("Error creando grupo:", error)
            alert("Error al conectar con el servidor.")
        }
    }

    return(
        <div className="sidebar">
            <PerfilCard cambiarVista={cambiarVista} abrirSolicitudes={abrirSolicitudes}/>

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
                            ultmsg="Toca para chatear"
                            time=""
                            esFavorito={amigo.esFavorito}
                            abrirChat={() => handleSeleccionarAmigo(amigo)}
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
                                ultmsg={grupo.rol === 'admin' ? "Administrador" : "Miembro"}
                                time=""
                                esFavorito={false}
                                abrirChat={() => handleSeleccionarGrupo(grupo)}
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