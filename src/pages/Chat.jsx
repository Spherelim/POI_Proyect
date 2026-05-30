import "./Chat.css"

import Sidebar from "../components/chat/Sidebar"
import ChatHeader from "../components/chat/ChatHeader"
import ChatInput from "../components/chat/ChatInput"
import Message from "../components/chat/Message"
import ChatInfoPanel from "../components/chat/ChatInfoPanel"
import Settings from "../components/Settings"
import Notificacion from "../components/Notificacion"
import Tareas from "../components/Tareas"
import Solicitudes from "../components/Solicitudes"

import { useEffect, useState, useRef } from "react"
import { socket } from "../socket"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

function Chat(){
    const usuario = JSON.parse(localStorage.getItem("usuario"))

    const [visita, setVista] = useState("chat")
    const [mostrarInfo, setMostrarInfo] = useState(false)
    const [mostrarSolicitudes, setMostrarSolicitudes] = useState(false)
    const [amigoActivo, setAmigoActivo] = useState(null)
    const amigoActivoRef = useRef(null)
    const [mensaje, setMensaje] = useState("")
    const [mensajes, setMensajes] = useState([])
    const mensajesEndRef = useRef(null)
    const mensajesContainerRef = useRef(null)
    const [actualizarSidebar, setActualizarSidebar] = useState(0)
    const [sidebarVisible, setSidebarVisible] = useState(true)

    const prevGrupoRef = useRef(null)

    // Detectar móvil
    const isMobile = () => window.innerWidth <= 640

    useEffect(() => {
        amigoActivoRef.current = amigoActivo
        console.log("amigoActivo cambió a:", amigoActivo)
    }, [amigoActivo])

    useEffect(() => {
        // Scroll directo al contenedor para evitar que scrollIntoView mueva el document
        if (mensajesContainerRef.current) {
            mensajesContainerRef.current.scrollTop = mensajesContainerRef.current.scrollHeight
        }
    }, [mensajes])

    useEffect(() => {
        // Salir de la sala del grupo anterior si aplica
        if (prevGrupoRef.current) {
            socket.emit("leave_group", prevGrupoRef.current)
            prevGrupoRef.current = null
        }

        if (!amigoActivo) {
            console.log("No hay amigo activo, no cargar mensajes")
            return
        }

        // Unirse a la sala del grupo nuevo si aplica
        if (amigoActivo.esGrupo) {
            socket.emit("join_group", amigoActivo.ID_Conversacion)
            prevGrupoRef.current = amigoActivo.ID_Conversacion
        }

        console.log("Cargando mensajes para:", amigoActivo.esGrupo ? "grupo " + amigoActivo.nombreGrupo : amigoActivo.NombreUsuario)
        setMensajes([])
        cargarMensajes(amigoActivo)

        // Registrar un listener de reconexión para volver a unirse al grupo si se cae la conexión
        const handleConnect = () => {
            if (amigoActivo && amigoActivo.esGrupo) {
                console.log("Re-uniéndose al grupo por reconexión:", amigoActivo.ID_Conversacion)
                socket.emit("join_group", amigoActivo.ID_Conversacion)
            }
        }

        socket.on("connect", handleConnect)

        return () => {
            socket.off("connect", handleConnect)
        }
    }, [amigoActivo])

    useEffect(() => {
        console.log("Registrando usuario en socket:", usuario?.id)
        if (usuario?.id) {
            socket.emit("registrar", usuario.id)
        }

        // ── Actualizaciones en tiempo real de grupos ──────────────────
        // Nuevo grupo creado o agregado a uno — refrescar sidebar
        const onGrupoCreado = () => {
            setActualizarSidebar(prev => prev + 1)
        }

        // Cambio en el grupo activo (rol, miembros) — refrescar panel info
        const onGrupoActualizado = ({ idConversacion, idMiembro }) => {
            setActualizarSidebar(prev => prev + 1)
            // Si estamos viendo ese grupo, forzar recarga del panel
            if (amigoActivoRef.current?.ID_Conversacion === idConversacion) {
                // Actualizar la referencia para disparar el useEffect de amigoActivo
                setAmigoActivo(prev => prev ? { ...prev } : prev)
            }
        }

        // Expulsado del grupo — cerrar vista del grupo
        const onExpulsadoGrupo = ({ idConversacion }) => {
            setActualizarSidebar(prev => prev + 1)
            if (amigoActivoRef.current?.ID_Conversacion === idConversacion) {
                setAmigoActivo(null)
                setMostrarInfo(false)
            }
        }

        socket.on("grupo_creado", onGrupoCreado)
        socket.on("grupo_actualizado", onGrupoActualizado)
        socket.on("expulsado_grupo", onExpulsadoGrupo)

        return () => {
            socket.off("grupo_creado", onGrupoCreado)
            socket.off("grupo_actualizado", onGrupoActualizado)
            socket.off("expulsado_grupo", onExpulsadoGrupo)
        }
    }, [])

    const cargarMensajes = async (activo = amigoActivo) => {
        if (!activo) return
        try {
            let url = ""
            if (activo.esGrupo) {
                url = `${API_URL}/mensajes/grupo/${activo.ID_Conversacion}`
            } else {
                url = `${API_URL}/mensajes/${usuario?.id}/${activo.ID_Us}`
            }

            console.log("Fetch mensajes desde:", url)
            const res = await fetch(url)
            const data = await res.json()
            console.log("Mensajes recibidos:", data)
            const formateados = data.map(m => ({
                text: m.mensaje,
                type: String(m.id_remitente) === String(usuario?.id) ? "right" : "left",
                senderName: activo.esGrupo ? (m.NombreUsuario || m.nombreUsuario) : null
            }))
            setMensajes(formateados)
        } catch (error) {
            console.error("Error cargando mensajes:", error)
        }
    }

    useEffect(() => {
        // Mensaje directo
        socket.on("mensaje", (data) => {
            console.log("Mensaje recibido por socket:", data)
            const amigoActual = amigoActivoRef.current
            if (amigoActual && !amigoActual.esGrupo && String(data.idEmisor) === String(amigoActual.ID_Us)) {
                setMensajes(prev => [...prev, { text: data.text, type: "left" }])
            }
        })

        // Mensaje grupal
        socket.on("mensaje_grupo", (data) => {
            console.log("Mensaje grupal recibido por socket:", data)
            const amigoActual = amigoActivoRef.current
            if (amigoActual && amigoActual.esGrupo && String(data.idConversacion) === String(amigoActual.ID_Conversacion)) {
                setMensajes(prev => [...prev, { 
                    text: data.text, 
                    type: "left", 
                    senderName: data.nombreEmisor 
                }])
            }
        })

        return () => { 
            socket.off("mensaje") 
            socket.off("mensaje_grupo")
        }
    }, [])

    const enviarMensaje = async () => {
        if (mensaje.trim() === "" || !amigoActivo) return

        const textoEnviar = mensaje
        setMensaje("")

        try {
            if (amigoActivo.esGrupo) {
                await fetch(`${API_URL}/mensajes/grupo/enviar`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        idConversacion: amigoActivo.ID_Conversacion,
                        idEmisor: usuario.id,
                        contenido: textoEnviar
                    })
                })

                socket.emit("mensaje_grupo", {
                    idConversacion: amigoActivo.ID_Conversacion,
                    text: textoEnviar,
                    idEmisor: usuario.id,
                    nombreEmisor: usuario.nombreUsuario
                })

                setMensajes(prev => [...prev, { text: textoEnviar, type: "right" }])
            } else {
                await fetch(`${API_URL}/mensajes/enviar`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        idEmisor: usuario.id,
                        idReceptor: amigoActivo.ID_Us,
                        contenido: textoEnviar
                    })
                })

                socket.emit("mensaje", {
                    text: textoEnviar,
                    idEmisor: usuario.id,
                    idReceptor: amigoActivo.ID_Us
                })

                setMensajes(prev => [...prev, { text: textoEnviar, type: "right" }])
            }
        } catch (error) {
            console.error("Error enviando mensaje:", error)
        }
    }

    const handleAmigoActualizado = () => {
        setActualizarSidebar(prev => prev + 1)
    }

    const handleSeleccionarAmigo = (amigo) => {
        console.log("Seleccionando amigo en Chat:", amigo)
        setAmigoActivo(amigo)
        setVista("chat")
        // En móvil ocultar sidebar al seleccionar chat
        if (isMobile()) setSidebarVisible(false)
    }

    const handleCambiarVista = (vista) => {
        setVista(vista)
        // En móvil: ocultar sidebar para ver el contenido
        if (isMobile()) setSidebarVisible(false)
    }

    const handleVolverSidebar = () => {
        setSidebarVisible(true)
        setAmigoActivo(null)
        setMostrarInfo(false)
    }

    const VistaGenerica = ({ titulo, children }) => (
    <div style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        position: "relative"
    }}>
        <div className="chat-header" style={{
            justifyContent: "space-between",
            flexShrink: 0,
            position: "sticky",
            top: 0,
            zIndex: 2
        }}>
            {/* Botón volver en móvil */}
            <button
                className="btn-volver-mobile"
                onClick={() => { setVista("chat"); setSidebarVisible(true) }}
                aria-label="Volver"
                style={{display: "flex"}}
            >
                ←
            </button>
            <h3 style={{margin: 0, color: "white", flex: 1, textAlign: "center"}}>{titulo}</h3>
            <div style={{width: 36}}/>{/* espaciador para centrar titulo */}
        </div>
        <div style={{
            flex: 1,
            minHeight: 0,
            overflow: "auto",
            position: "relative"
        }}>
            {children}
        </div>
    </div>
)

    const NoChatSeleccionado = () => (
        <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "15px",
            background: "rgba(0,0,0,0.15)"
        }}>
            <div style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "35px"
            }}>💬</div>
            <p style={{color:"rgba(255,255,255,0.5)", fontSize:"16px", margin:0}}>
                Selecciona un chat para comenzar
            </p>
        </div>
    )

    return (
        <div className="Content-Chat">
            <Sidebar
                cambiarVista={handleCambiarVista}
                abrirSolicitudes={() => setMostrarSolicitudes(true)}
                seleccionarAmigo={handleSeleccionarAmigo}
                actualizarSidebar={actualizarSidebar}
                className={sidebarVisible ? "" : "oculto"}
            />

            <div className="Chat-area">

                {visita === "chat" && (
                    <>
                        {amigoActivo ? (
                            <>
                                <ChatHeader
                                    abrirInfo={() => setMostrarInfo(true)}
                                    amigo={amigoActivo}
                                    onVolver={handleVolverSidebar}
                                />
                                <div className="chat-messages" ref={mensajesContainerRef}>
                                    {mensajes.length === 0 ? (
                                        <p style={{color:"rgba(255,255,255,0.5)", textAlign:"center", marginTop:"20px"}}>
                                            No hay mensajes aún. ¡Envía uno!
                                        </p>
                                    ) : (
                                        mensajes.map((msg, index) => (
                                            <Message key={index} text={msg.text} type={msg.type} senderName={msg.senderName}/>
                                        ))
                                    )}
                                    <div ref={mensajesEndRef}/>
                                </div>
                                <ChatInput
                                    mensaje={mensaje}
                                    setMensaje={setMensaje}
                                    enviarMensaje={enviarMensaje}
                                />
                            </>
                        ) : (
                            <NoChatSeleccionado/>
                        )}
                    </>
                )}

                {visita === "ajustes" && (
                    <VistaGenerica titulo="Ajustes">
                        <Settings/>
                    </VistaGenerica>
                )}

                {visita === "noti" && (
                    <VistaGenerica titulo="Notificaciones">
                        <Notificacion/>
                    </VistaGenerica>
                )}

                {visita === "tareas" && (
                    <VistaGenerica titulo="Tareas">
                        <Tareas/>
                    </VistaGenerica>
                )}

            </div>

            {mostrarInfo && amigoActivo && (
                <ChatInfoPanel 
                    cerrarInfo={() => setMostrarInfo(false)}
                    amigo={amigoActivo}
                    usuarioActualId={usuario.id}
                    alSalirGrupo={() => {
                        setAmigoActivo(null)
                        setActualizarSidebar(prev => prev + 1)
                    }}
                />
            )}

            {mostrarSolicitudes && (
                <Solicitudes 
                    cerrar={() => setMostrarSolicitudes(false)}
                    onAmigoActualizado={handleAmigoActualizado}
                />
            )}

        </div>
    )
}

export default Chat