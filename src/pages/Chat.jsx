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

    useEffect(() => {
        amigoActivoRef.current = amigoActivo
    }, [amigoActivo])

    useEffect(() => {
        mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [mensajes])

    useEffect(() => {
        if (!amigoActivo) return
        setMensajes([])
        cargarMensajes()
    }, [amigoActivo])

    useEffect(() => {
        socket.emit("registrar", usuario.id)
    }, [])

    const cargarMensajes = async () => {
        if (!amigoActivoRef.current) return
        const res = await fetch(`${API_URL}/mensajes/${usuario.id}/${amigoActivoRef.current.ID_Us}`)
        const data = await res.json()
        const formateados = data.map(m => ({
            text: m.mensaje,
            type: m.id_remitente === usuario.id ? "right" : "left"
        }))
        setMensajes(formateados)
    }

    useEffect(() => {
        socket.on("mensaje", (data) => {
            const amigoActual = amigoActivoRef.current
            if (amigoActual && data.idEmisor === amigoActual.ID_Us) {
                setMensajes(prev => [...prev, { text: data.text, type: "left" }])
            }
        })
        return () => { socket.off("mensaje") }
    }, [])

    const enviarMensaje = async () => {
        if (mensaje.trim() === "" || !amigoActivo) return

        const textoEnviar = mensaje
        setMensaje("")

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
                cambiarVista={setVista}
                abrirSolicitudes={() => setMostrarSolicitudes(true)}
                seleccionarAmigo={(amigo) => {
                    setAmigoActivo(amigo)
                    setVista("chat")
                }}
            />

            <div className="Chat-area">

                {visita === "chat" && (
                    <>
                        {amigoActivo ? (
                            <>
                                <ChatHeader abrirInfo={() => setMostrarInfo(true)} amigo={amigoActivo}/>
                                <div className="chat-messages">
                                    {mensajes.map((msg, index) => (
                                        <Message key={index} text={msg.text} type={msg.type}/>
                                    ))}
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
                    <>
                        <ChatHeader amigo={amigoActivo}/>
                        <Settings/>
                    </>
                )}

                {visita === "noti" && (
                    <>
                        <ChatHeader amigo={amigoActivo}/>
                        <Notificacion/>
                    </>
                )}

                {visita === "tareas" && (
                    <>
                        <ChatHeader amigo={amigoActivo}/>
                        <Tareas/>
                    </>
                )}

            </div>

            {mostrarInfo && (
                <ChatInfoPanel cerrarInfo={() => setMostrarInfo(false)}/>
            )}

            {mostrarSolicitudes && (
                <Solicitudes cerrar={() => setMostrarSolicitudes(false)}/>
            )}

        </div>
    )
}

export default Chat