import "./Chat.css"
import { toast } from "react-toastify"


import Sidebar from "../components/chat/Sidebar"
import ChatHeader from "../components/chat/ChatHeader"
import ChatInput from "../components/chat/ChatInput"
import Message from "../components/chat/Message"
import ChatInfoPanel from "../components/chat/ChatInfoPanel"
import Settings from "../components/Settings"
import Notificacion from "../components/Notificacion"
import Tareas from "../components/Tareas"
import Tienda from "../components/Tienda"
import Solicitudes from "../components/Solicitudes"

import { useEffect, useState, useRef } from "react"
import { socket } from "../socket"
import { encriptar, desencriptar } from "../utils/crypto"

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
    const [encriptarMensajes, setEncriptarMensajes] = useState(false) // Toggle de encriptación
    const mensajesEndRef = useRef(null)
    const mensajesContainerRef = useRef(null)
    const [actualizarSidebar, setActualizarSidebar] = useState(0)
    const [sidebarVisible, setSidebarVisible] = useState(true)

    const prevGrupoRef = useRef(null)

    // --- ESTADOS Y REFS DE LLAMADAS (WEBRTC) ---
    const localVideoRef = useRef(null)
    const remoteVideoRef = useRef(null)
    const pcRef = useRef(null)
    const localStreamRef = useRef(null)
    const ofertaRecibidaRef = useRef(null)
    const datosLlamadaRef = useRef(null) // Para usar en callbacks asíncronos sin stale-state
    const candidatosColaRef = useRef([]) // Cola de candidatos ICE para evitar fallos de conexión

    const [enLlamada, setEnLlamada] = useState(false)
    const [llamando, setLlamando] = useState(false) 
    const [llamadaEntrante, setLlamadaEntrante] = useState(false) 
    const [datosLlamada, setDatosLlamada] = useState(null) // { to: ID, nombre: Nombre, tipo: 'video' | 'audio' }
    const [microfonoMuteado, setMicrofonoMuteado] = useState(false)
    const [camaraApagada, setCamaraApagada] = useState(false)
    const [camaraRemotaApagada, setCamaraRemotaApagada] = useState(false)
    const camaraRemotaApagadaRef = useRef(false) // Ref para evitar closures stale en callbacks WebRTC
    const [microfonoRemotoMuteado, setMicrofonoRemotoMuteado] = useState(false)

    const iceServers = [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" }
    ]

    const asegurarMediaLocal = async (tipo) => {
        if (localStreamRef.current) return localStreamRef.current
        
        console.log(`[WebRTC] Solicitando media local para tipo: ${tipo}...`)
        
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            const errorMsg = "Tu navegador o conexón HTTP no segura bloquea el acceso a la cámara y micrófono. Usa HTTPS."
            toast.error(errorMsg, { autoClose: 7000 })
            throw new Error(errorMsg)
        }

        try {
            // Siempre pedimos video+audio para poder activar cámara en cualquier momento
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            localStreamRef.current = stream

            // En llamada de audio, desactivar el track de video desde el inicio
            if (tipo === "audio") {
                stream.getVideoTracks().forEach(t => { t.enabled = false })
                setCamaraApagada(true)
            } else {
                setCamaraApagada(false)
            }

            // Siempre asignar srcObject al video local (el CSS decide si es visible)
            setTimeout(() => {
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream
                }
            }, 200)

            return stream
        } catch (error) {
            console.warn("[WebRTC] No se pudo acceder a cámara, fallback a solo audio:", error)
            try {
                const audioStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })
                localStreamRef.current = audioStream
                setCamaraApagada(true)
                return audioStream
            } catch (audioError) {
                console.error("[WebRTC] También falló el audio:", audioError)
                toast.error("No se pudo acceder a cámara ni micrófono. Verifica los permisos.")
                throw audioError
            }
        }
    }

    const asegurarPeerConnection = async (idDestinatario) => {
        if (pcRef.current) return pcRef.current
        
        console.log("[WebRTC] Inicializando RTCPeerConnection...")
        const pc = new RTCPeerConnection({ iceServers })
        pcRef.current = pc
        candidatosColaRef.current = [] // Limpiar la cola de candidatos

        // Cuando aparezca la pista de video/audio remota
        pc.ontrack = (event) => {
            console.log("[WebRTC] Track remoto recibido:", event.track.kind, event.streams)
            const [remoteStream] = event.streams

            // Si llega un track de video activo, mostrar el video remoto inmediatamente
            if (event.track.kind === "video") {
                event.track.onunmute = () => {
                    console.log("[WebRTC] Track de video remoto se activó (unmute)")
                    setCamaraRemotaApagada(false)
                    camaraRemotaApagadaRef.current = false
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = remoteStream
                    }
                }
            }

            setTimeout(() => {
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = remoteStream
                }
                // Si llega un track de video habilitado, mostrar el video remoto automáticamente
                if (event.track.kind === "video" && event.track.enabled) {
                    setCamaraRemotaApagada(false)
                    camaraRemotaApagadaRef.current = false
                }
            }, 300)
        }

        // Reenviar candidatos ICE a través de sockets
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                console.log("Enviando candidato ICE a:", idDestinatario)
                socket.emit("webrtc-ice-candidate", {
                    to: idDestinatario,
                    candidate: event.candidate
                })
            }
        }

        pc.onconnectionstatechange = () => {
            console.log("Estado de conexión WebRTC cambiado:", pc.connectionState)
            if (pc.connectionState === "failed" || pc.connectionState === "disconnected" || pc.connectionState === "closed") {
                finalizarLlamada()
            }
        }

        return pc
    }

    const iniciarLlamada = async (tipo) => {
        if (!amigoActivo) return
        setLlamando(true)
        setCamaraRemotaApagada(tipo === "audio")
        camaraRemotaApagadaRef.current = (tipo === "audio")
        setMicrofonoRemotoMuteado(false)
        const nomEmisor = usuario.nombreUsuario || usuario.NombreUsuario || usuario.nombre || usuario.Nombre || "Usuario"
        const nomReceptor = amigoActivo.NombreUsuario || amigoActivo.nombreUsuario || amigoActivo.nombre || amigoActivo.Nombre || "Contacto"
        
        const infoLlamada = { 
            to: amigoActivo.ID_Us, 
            nombre: nomReceptor, 
            tipo,
            nombreEmisor: nomEmisor,
            nombreReceptor: nomReceptor
        }
        setDatosLlamada(infoLlamada)
        datosLlamadaRef.current = infoLlamada

        try {
            const stream = await asegurarMediaLocal(tipo)
            const pc = await asegurarPeerConnection(amigoActivo.ID_Us)

            // Limpiar tracks anteriores si los hay
            pc.getSenders().forEach(sender => pc.removeTrack(sender))

            // Añadir pistas locales al Peer Connection
            stream.getTracks().forEach(track => {
                pc.addTrack(track, stream)
            })

            const offer = await pc.createOffer()
            await pc.setLocalDescription(offer)

            console.log("Enviando oferta WebRTC a:", amigoActivo.ID_Us)
            socket.emit("webrtc-offer", {
                to: amigoActivo.ID_Us,
                sdp: pc.localDescription,
                tipo,
                nombreEmisor: nomEmisor,
                nombreReceptor: nomReceptor
            })

            // Notificar el estado inicial de cámara/micro al receptor
            // Para que el receptor sepa desde el inicio si la cámara está apagada
            socket.emit("webrtc-toggle-video", {
                to: amigoActivo.ID_Us,
                enabled: tipo === "video" // false si es audio, true si es video
            })

            // Tarea de hacer una llamada (ID 11 en la base de datos)
            await fetch(`${API_URL}/tareas/progreso`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idUsuario: usuario.id,
                    idTarea: 11,
                    incremento: 1
                })
            }).catch(e => console.error("Error al registrar progreso de llamada:", e))

        } catch (e) {
            console.error("Error al iniciar la llamada:", e)
            finalizarLlamada()
        }
    }

    const aceptarLlamada = async () => {
        const info = datosLlamadaRef.current
        if (!info) return

        setLlamadaEntrante(false)
        setEnLlamada(true)
        setCamaraRemotaApagada(info.tipo === "audio")
        camaraRemotaApagadaRef.current = (info.tipo === "audio")
        setMicrofonoRemotoMuteado(false)

        try {
            const stream = await asegurarMediaLocal(info.tipo)
            const pc = await asegurarPeerConnection(info.to)

            // Añadir pistas locales al Peer Connection
            stream.getTracks().forEach(track => {
                pc.addTrack(track, stream)
            })

            // Cargar la descripción remota guardada
            if (ofertaRecibidaRef.current) {
                await pc.setRemoteDescription(new RTCSessionDescription(ofertaRecibidaRef.current))
                console.log("[WebRTC] Descripción remota aplicada en receptor. Procesando candidatos en cola...")
                // Aplicar candidatos ICE encolados
                if (candidatosColaRef.current.length > 0) {
                    candidatosColaRef.current.forEach(cand => {
                        pc.addIceCandidate(new RTCIceCandidate(cand))
                            .then(() => console.log("[WebRTC] Candidato encolado aplicado exitosamente"))
                            .catch(err => console.error("[WebRTC] Error aplicando candidato encolado:", err))
                    })
                    candidatosColaRef.current = []
                }
            }

            const answer = await pc.createAnswer()
            await pc.setLocalDescription(answer)

            console.log("Enviando respuesta WebRTC (Answer) a:", info.to)
            socket.emit("webrtc-answer", {
                to: info.to,
                sdp: pc.localDescription
            })

            // Notificar al emisor el estado inicial de la cámara del receptor
            socket.emit("webrtc-toggle-video", {
                to: info.to,
                enabled: info.tipo === "video" // false si es llamada de audio
            })

            // Tarea de contestar videollamada (ID 13 en la base de datos)
            await fetch(`${API_URL}/tareas/progreso`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idUsuario: usuario.id,
                    idTarea: 13,
                    incremento: 1
                })
            }).catch(e => console.error("Error al registrar progreso de contestar llamada:", e))

        } catch (e) {
            console.error("Error al aceptar llamada:", e)
            finalizarLlamada()
        }
    }

    const rechazarLlamada = () => {
        const info = datosLlamadaRef.current
        if (info) {
            socket.emit("webrtc-reject", { to: info.to })
            socket.emit("webrtc-hangup", { to: info.to })
        }
        finalizarLlamada()
    }

    const colgar = () => {
        const info = datosLlamadaRef.current
        if (info) {
            socket.emit("webrtc-hangup", { to: info.to })
        }
        finalizarLlamada()
    }

    const finalizarLlamada = () => {
        setEnLlamada(false)
        setLlamando(false)
        setLlamadaEntrante(false)
        setDatosLlamada(null)
        
        ofertaRecibidaRef.current = null
        datosLlamadaRef.current = null
        setMicrofonoMuteado(false)
        setCamaraApagada(false)
        setCamaraRemotaApagada(false)
        camaraRemotaApagadaRef.current = false
        setMicrofonoRemotoMuteado(false)

        // Detener media local
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(t => t.stop())
            localStreamRef.current = null
        }

        // Cerrar conexión WebRTC
        if (pcRef.current) {
            try { pcRef.current.close() } catch {}
            pcRef.current = null
        }

        // Limpiar srcObjects
        if (localVideoRef.current) localVideoRef.current.srcObject = null
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null
    }

    const toggleMicrofono = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0]
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled
                setMicrofonoMuteado(!audioTrack.enabled)

                // Informar al otro peer sobre el cambio de estado de audio
                const info = datosLlamadaRef.current
                if (info) {
                    socket.emit("webrtc-toggle-audio", {
                        to: info.to,
                        enabled: audioTrack.enabled
                    })
                }
            }
        }
    }

    const toggleCamara = async () => {
        if (!localStreamRef.current) return

        let videoTrack = localStreamRef.current.getVideoTracks()[0]

        if (!videoTrack) {
            // No hay track de video en absoluto (fallback de solo audio): intentar añadir uno
            try {
                console.log("[WebRTC] No hay track de video, adquiriendo dinámicamente...")
                const tempStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                videoTrack = tempStream.getVideoTracks()[0]
                if (!videoTrack) return

                localStreamRef.current.addTrack(videoTrack)

                // Añadir al PeerConnection y renegociar
                if (pcRef.current) {
                    const yaExiste = pcRef.current.getSenders().some(s => s.track?.kind === "video")
                    if (!yaExiste) pcRef.current.addTrack(videoTrack, localStreamRef.current)
                    const offer = await pcRef.current.createOffer()
                    await pcRef.current.setLocalDescription(offer)
                    const info = datosLlamadaRef.current
                    if (info) {
                        socket.emit("webrtc-offer", { to: info.to, sdp: pcRef.current.localDescription, tipo: info.tipo, nombreEmisor: info.nombreEmisor, nombreReceptor: info.nombreReceptor })
                        socket.emit("webrtc-toggle-video", { to: info.to, enabled: true })
                    }
                }
            } catch (err) {
                console.error("[WebRTC] Error adquiriendo cámara:", err)
                toast.error("No se pudo acceder a la cámara.")
                return
            }
        } else {
            // Toggle normal del track existente
            videoTrack.enabled = !videoTrack.enabled

            const info = datosLlamadaRef.current
            if (info) {
                socket.emit("webrtc-toggle-video", { to: info.to, enabled: videoTrack.enabled })
            }
        }

        // Actualizar estado y SIEMPRE reasignar srcObject para que el PiP no se pierda
        const enabled = videoTrack.enabled
        setCamaraApagada(!enabled)
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStreamRef.current
        }
    }


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
                text: desencriptar(m.mensaje), // Siempre descifrar al cargar (si no está cifrado, desencriptar() devuelve el mismo texto)
                type: String(m.id_remitente) === String(usuario?.id) ? "right" : "left",
                senderName: activo.esGrupo ? (m.NombreUsuario || m.nombreUsuario) : null,
                tipo: m.tipo || "texto",
                archivo: m.archivo || null
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

            // Siempre descifrar antes de mostrar en UI (si no está cifrado, desencriptar() lo devuelve igual)
            const textoLimpio = desencriptar(data.text)

            if (amigoActual && !amigoActual.esGrupo && String(data.idEmisor) === String(amigoActual.ID_Us)) {
                setMensajes(prev => [...prev, {
                    text: textoLimpio,  // Guardamos siempre en claro
                    type: "left",
                    tipo: data.tipo || "texto",
                    archivo: data.archivo || null
                }])
            } else {
                // Notificar en Toast siempre en claro
                const contenidoMostrar = data.tipo === "imagen" ? "🖼️ Imagen" : data.tipo === "archivo" ? "📎 Archivo" : textoLimpio
                toast.info(`✉️ Nuevo mensaje de ${data.nombreEmisor || "un contacto"}: "${contenidoMostrar}"`)
            }
        })

        // Mensaje grupal
        socket.on("mensaje_grupo", (data) => {
            console.log("Mensaje grupal recibido por socket:", data)
            const amigoActual = amigoActivoRef.current

            // Siempre descifrar antes de mostrar
            const textoLimpio = desencriptar(data.text)

            if (amigoActual && amigoActual.esGrupo && String(data.idConversacion) === String(amigoActual.ID_Conversacion)) {
                setMensajes(prev => [...prev, {
                    text: textoLimpio,  // Guardamos siempre en claro
                    type: "left",
                    senderName: data.nombreEmisor,
                    tipo: data.tipo || "texto",
                    archivo: data.archivo || null
                }])
            } else {
                // Notificar en Toast de forma elegante
                const contenidoMostrar = data.tipo === "imagen" ? "🖼️ Imagen" : data.tipo === "archivo" ? "📎 Archivo" : textoLimpio
                toast.info(`👥 Grupo "${data.nombreGrupo || "Grupal"}": [${data.nombreEmisor || "Miembro"}]: "${contenidoMostrar}"`)
            }
        })

        // Mensajes recibidos mientras estabas desconectado
        socket.on("mensajes_pendientes", (pendingMsgs) => {
            console.log("Mensajes pendientes recibidos:", pendingMsgs)
            
            pendingMsgs.forEach(msg => {
                // Notificación visual de Toast
                toast.info(`✉️ Nuevo mensaje de ${msg.nombreEmisor}`)

                // Si el chat con el emisor está abierto actualmente, pintarlo en vivo
                const amigoActual = amigoActivoRef.current
                if (amigoActual && !amigoActual.esGrupo && String(msg.id_remitente) === String(amigoActual.ID_Us)) {
                    setMensajes(prev => [...prev, {
                        text: msg.mensaje,
                        type: "left",
                        tipo: msg.tipo || "texto",
                        archivo: msg.archivo || null
                    }])
                }
            })
        })

        // --- SEÑALIZACIÓN WEBRTC POR SOCKETS ---
        socket.on("webrtc-offer", async (data) => {
            if (String(data.from) === String(usuario?.id)) {
                console.log("[WebRTC] Ignorando webrtc-offer propia.")
                return
            }
            
            // Si ya estamos en una llamada activa con este usuario específico, es una renegociación
            if (enLlamada && datosLlamadaRef.current && String(datosLlamadaRef.current.to) === String(data.from)) {
                console.log("[WebRTC] Recibida oferta de renegociación (por ejemplo, cámara encendida).")
                if (pcRef.current) {
                    try {
                        await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.sdp))
                        const answer = await pcRef.current.createAnswer()
                        await pcRef.current.setLocalDescription(answer)
                        socket.emit("webrtc-answer", {
                            to: data.from,
                            sdp: pcRef.current.localDescription
                        })
                    } catch (e) {
                        console.error("[WebRTC] Error durante renegociación de oferta:", e)
                    }
                }
                return
            }

            // Si el usuario ya está ocupado en una llamada (marcando, recibiendo o activa con otro)
            if (datosLlamadaRef.current || llamando || llamadaEntrante || enLlamada) {
                console.log(`[WebRTC] Ocupado. Rechazando llamada de ${data.from} con webrtc-busy.`)
                socket.emit("webrtc-busy", { to: data.from })
                return
            }

            console.log("Oferta WebRTC recibida de:", data.from)
            ofertaRecibidaRef.current = data.sdp

            // Valores de fallback
            let nomEmisor = data.nombreEmisor || "Un contacto"
            let fotoEmisor = null
            const nomReceptor = data.nombreReceptor || (usuario.nombreUsuario || usuario.NombreUsuario || usuario.nombre || usuario.Nombre || "ti")

            // Obtener datos del emisor en tiempo real desde la BD
            try {
                const resUser = await fetch(`${API_URL}/usuarios/detalles/${data.from}`)
                if (resUser.ok) {
                    const dataUser = await resUser.json()
                    nomEmisor = dataUser.NombreUsuario || dataUser.nombreUsuario || nomEmisor
                    fotoEmisor = dataUser.Foto || null
                }
            } catch (errDet) {
                console.error("Error al consultar detalles de emisor:", errDet)
            }
            
            const info = { 
                to: data.from, 
                nombre: nomEmisor, 
                tipo: data.tipo || "video",
                nombreEmisor: nomEmisor,
                nombreReceptor: nomReceptor,
                fotoEmisor: fotoEmisor
            }
            setDatosLlamada(info)
            datosLlamadaRef.current = info
            setLlamadaEntrante(true)
            
            toast.info(`📞 ${nomEmisor} te está llamando a ti, ${nomReceptor}`, { autoClose: 5000 })
        })

        socket.on("webrtc-answer", async (data) => {
            if (String(data.from) === String(usuario?.id)) return
            console.log("Respuesta WebRTC recibida de:", data.from)
            if (pcRef.current) {
                try {
                    await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.sdp))
                    setEnLlamada(true)
                    setLlamando(false)
                    
                    console.log("[WebRTC] Descripción remota aplicada en emisor (Answer). Procesando candidatos en cola...")
                    if (candidatosColaRef.current.length > 0) {
                        candidatosColaRef.current.forEach(cand => {
                            pcRef.current.addIceCandidate(new RTCIceCandidate(cand))
                                .then(() => console.log("[WebRTC] Candidato encolado aplicado exitosamente"))
                                .catch(err => console.error("[WebRTC] Error aplicando candidato encolado:", err))
                        })
                        candidatosColaRef.current = []
                    }
                } catch (e) {
                    console.error("Error aplicando descripción remota (Answer):", e)
                }
            }
        })

        socket.on("webrtc-ice-candidate", async (data) => {
            if (String(data.from) === String(usuario?.id)) return
            console.log("Candidato ICE recibido de:", data.from)
            if (pcRef.current && pcRef.current.remoteDescription && pcRef.current.remoteDescription.type) {
                try {
                    await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate))
                    console.log("[WebRTC] Candidato ICE aplicado de forma directa.")
                } catch (e) {
                    console.error("Error agregando candidato ICE directo:", e)
                }
            } else {
                console.log("[WebRTC] Guardando candidato ICE en cola porque la descripción remota no está lista aún.")
                candidatosColaRef.current.push(data.candidate)
            }
        })

        socket.on("webrtc-toggle-video", (data) => {
            if (String(data.from) === String(usuario?.id)) return
            console.warn("[WebRTC] Toggle VIDEO remoto recibido. Habilitado:", data.enabled, "de:", data.from)
            setCamaraRemotaApagada(!data.enabled)
            camaraRemotaApagadaRef.current = !data.enabled
        })

        socket.on("webrtc-toggle-audio", (data) => {
            if (String(data.from) === String(usuario?.id)) return
            console.warn("[WebRTC] Toggle AUDIO remoto recibido. Habilitado:", data.enabled, "de:", data.from)
            setMicrofonoRemotoMuteado(!data.enabled)
        })

        socket.on("webrtc-hangup", (data) => {
            if (String(data.from) === String(usuario?.id)) return
            console.log("Llamada finalizada por el otro peer:", data.from)
            finalizarLlamada()
            toast.info("Llamada finalizada.")
        })

        // agreagado
        socket.on("webrtc-reject", async (data) => {
            if (String(data.from) === String(usuario?.id)) return
            console.log("Llamada rechazada por:", data.from)
            toast.info("El usuario ha rechazado la llamada.")
            
            // Actualizar tarea de "Te han rechazado una videollamada" (idTarea = 12)
            try {
                await fetch(`${API_URL}/tareas/progreso`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        idUsuario: usuario.id,
                        idTarea: 12,
                        incremento: 1
                    })
                })
                console.log("Tarea de rechazo registrada correctamente")
            } catch (error) {
                console.error("Error registrando tarea de rechazo:", error)
            }
            
            finalizarLlamada()
        })

        socket.on("webrtc-busy", (data) => {
            if (String(data.from) === String(usuario?.id)) return
            console.log("El otro usuario está ocupado:", data.from)
            toast.error("El usuario está ocupado en otra llamada en este momento.")
            finalizarLlamada()
        })

        return () => { 
            socket.off("mensaje") 
            socket.off("mensaje_grupo")
            socket.off("mensajes_pendientes")
            socket.off("webrtc-offer")
            socket.off("webrtc-answer")
            socket.off("webrtc-ice-candidate")
            socket.off("webrtc-toggle-video")
            socket.off("webrtc-toggle-audio")
            socket.off("webrtc-hangup")
            socket.off("webrtc-busy")
        }
    }, [])

    // useEffect dedicado para toggle de cámara/micrófono remoto
    // Se re-registra cada vez que enLlamada cambia para evitar closures stale
    useEffect(() => {
        const handleToggleVideo = (data) => {
            if (String(data.from) === String(usuario?.id)) return
            console.warn("[WebRTC] Toggle VIDEO (useEffect dinámico). Habilitado:", data.enabled)
            setCamaraRemotaApagada(!data.enabled)
            camaraRemotaApagadaRef.current = !data.enabled
        }

        const handleToggleAudio = (data) => {
            if (String(data.from) === String(usuario?.id)) return
            console.warn("[WebRTC] Toggle AUDIO (useEffect dinámico). Habilitado:", data.enabled)
            setMicrofonoRemotoMuteado(!data.enabled)
        }

        // Remover listeners anteriores y re-registrar frescos
        socket.off("webrtc-toggle-video")
        socket.off("webrtc-toggle-audio")
        socket.on("webrtc-toggle-video", handleToggleVideo)
        socket.on("webrtc-toggle-audio", handleToggleAudio)

        return () => {
            socket.off("webrtc-toggle-video", handleToggleVideo)
            socket.off("webrtc-toggle-audio", handleToggleAudio)
        }
    }, [enLlamada, usuario?.id])


    const enviarMensaje = async () => {
        if (mensaje.trim() === "" || !amigoActivo) return

        // textoEnviar: va cifrado a la BD y al socket (si cifrado activo)
        // El texto en claro (mensaje) se muestra en la UI del emisor
        const textoEnviar = encriptarMensajes ? encriptar(mensaje) : mensaje
        const textoParaMostrar = mensaje // La UI siempre muestra en claro
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
                    nombreEmisor: usuario.nombreUsuario || usuario.NombreUsuario,
                    nombreGrupo: amigoActivo.nombreGrupo
                })

                setMensajes(prev => [...prev, { text: textoParaMostrar, type: "right", tipo: "texto" }])
            } else {
                await fetch(`${API_URL}/mensajes/enviar`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        idEmisor: usuario.id,
                        idReceptor: amigoActivo.ID_Us,
                        contenido: textoEnviar // Cifrado si activo
                    })
                })

                socket.emit("mensaje", {
                    text: textoEnviar, // El receptor lo descifra al recibirlo
                    idEmisor: usuario.id,
                    idReceptor: amigoActivo.ID_Us,
                    nombreEmisor: usuario.nombreUsuario || usuario.NombreUsuario
                })

                setMensajes(prev => [...prev, { text: textoParaMostrar, type: "right", tipo: "texto" }])
            }
        } catch (error) {
            console.error("Error enviando mensaje:", error)
        }
    }

    // Callback cuando se sube un archivo exitosamente
    const handleArchivoEnviado = (file, activo, urlFinal) => {
        const esImagen = file.type.startsWith("image/")
        const tipo = esImagen ? "imagen" : "archivo"

        // Agregar el mensaje localmente con la URL final (Cloudinary o Fallback)
        setMensajes(prev => [...prev, {
            text: file.name,
            type: "right",
            tipo,
            archivo: urlFinal
        }])

        // Notificar via socket para que el receptor vea el archivo en tiempo real con su URL
        if (activo.esGrupo) {
            socket.emit("mensaje_grupo", {
                idConversacion: activo.ID_Conversacion,
                text: file.name,
                idEmisor: usuario.id,
                nombreEmisor: usuario.nombreUsuario || usuario.NombreUsuario,
                nombreGrupo: activo.nombreGrupo,
                tipo,
                archivo: urlFinal
            })
        } else {
            socket.emit("mensaje", {
                text: file.name,
                idEmisor: usuario.id,
                idReceptor: activo.ID_Us,
                nombreEmisor: usuario.nombreUsuario || usuario.NombreUsuario,
                tipo,
                archivo: urlFinal
            })
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
                                    onIniciarLlamada={iniciarLlamada}
                                />
                                <div className="chat-messages" ref={mensajesContainerRef}>
                                    {mensajes.length === 0 ? (
                                        <p style={{color:"rgba(255,255,255,0.5)", textAlign:"center", marginTop:"20px"}}>
                                            No hay mensajes aún. ¡Envía uno!
                                        </p>
                                    ) : (
                                        mensajes.map((msg, index) => (
                                            <Message
                                                key={index}
                                                text={desencriptar(msg.text)}
                                                type={msg.type}
                                                senderName={msg.senderName}
                                                tipo={msg.tipo}
                                                archivo={msg.archivo}
                                            />
                                        ))
                                    )}
                                    <div ref={mensajesEndRef}/>
                                </div>
                                <ChatInput
                                    mensaje={mensaje}
                                    setMensaje={setMensaje}
                                    enviarMensaje={enviarMensaje}
                                    onArchivoEnviado={handleArchivoEnviado}
                                    amigoActivo={amigoActivo}
                                    usuarioId={usuario?.id}
                                    encriptarMensajes={encriptarMensajes}
                                    setEncriptarMensajes={setEncriptarMensajes}
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
                

                {/* agregado */}
                {visita === "tienda" && (
                    <VistaGenerica titulo="Tienda">
                        <Tienda/>
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

            {/* --- INTERFAZ FLOTANTE DE WEBRTC PARA LLAMADAS Y VIDEOLLAMADAS --- */}
            {(llamando || llamadaEntrante || enLlamada) && (
                <div className="webrtc-overlay-container">
                    
                    {/* Caso 1: Marcando / Llamando saliente */}
                    {llamando && datosLlamada && (
                        <div className="webrtc-modal card-glassmorphism animate-pulse">
                            <div className="webrtc-avatar">📞</div>
                            <h2>Llamando a {datosLlamada.nombreReceptor}</h2>
                            <p>Esperando respuesta...</p>
                            <button className="webrtc-btn btn-decline" onClick={colgar} aria-label="Cancelar llamada">
                                📞
                            </button>
                        </div>
                    )}

                    {/* Caso 2: Llamada entrante */}
                    {llamadaEntrante && datosLlamada && (
                        <div className="webrtc-modal card-glassmorphism animate-bounce-subtle">
                            <div className="webrtc-avatar-wrapper">
                                <img 
                                    src={datosLlamada.fotoEmisor 
                                        ? (datosLlamada.fotoEmisor.startsWith("http") ? datosLlamada.fotoEmisor : `${API_URL}${datosLlamada.fotoEmisor}`) 
                                        : "/src/assets/images/Conejito.jpg"
                                    } 
                                    alt="Foto Perfil Emisor" 
                                    className="webrtc-avatar-img blink-green" 
                                    onError={(e) => { e.target.src = "/src/assets/images/Conejito.jpg" }}
                                />
                                <div className="webrtc-avatar-badge">
                                    {datosLlamada.tipo === "video" ? "📹" : "📞"}
                                </div>
                            </div>
                            <h2>
                                {datosLlamada.tipo === "video" 
                                    ? `${datosLlamada.nombreEmisor} desea hacer videollamada` 
                                    : `${datosLlamada.nombreEmisor} te está marcando`
                                }
                            </h2>
                            <div className="webrtc-actions-row" style={{ marginTop: '10px' }}>
                                <button className="webrtc-btn btn-accept" onClick={aceptarLlamada} aria-label="Contestar">
                                    ✔️
                                </button>
                                <button className="webrtc-btn btn-decline" onClick={rechazarLlamada} aria-label="Rechazar">
                                    ❌
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Caso 3: En llamada activa (Unificada para Audio y Video) */}
                    {enLlamada && datosLlamada && (() => {
                        const miNombre = usuario.nombreUsuario || usuario.NombreUsuario || "Tú"
                        const nombreRemoto = datosLlamada.nombreEmisor === miNombre 
                            ? datosLlamada.nombreReceptor 
                            : datosLlamada.nombreEmisor
                        return (
                        <div className="webrtc-active-call card-glassmorphism">
                            <div className="call-header-info">
                                <span className="pulse-dot"></span>
                                <p>Llamada activa: {datosLlamada.nombreEmisor} ⇆ {datosLlamada.nombreReceptor}</p>
                            </div>

                            <div className="webrtc-video-grid">

                                {/* ===== VIDEO REMOTO (pantalla principal) ===== */}
                                <div className="webrtc-remote-container">
                                    <video
                                        ref={remoteVideoRef}
                                        autoPlay
                                        playsInline
                                        className="webrtc-video-remote"
                                        style={{ display: camaraRemotaApagada ? 'none' : 'block' }}
                                    />

                                    {/* Overlay cuando cámara remota está apagada */}
                                    {camaraRemotaApagada && (
                                        <div className="webrtc-audio-placeholder-overlay" style={{ opacity: 1, pointerEvents: 'none' }}>
                                            <div className="pulsing-circle">🎙️</div>
                                            <p style={{ marginTop: 12, fontSize: 15, color: 'rgba(255,255,255,0.8)' }}>
                                                En línea con {nombreRemoto}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* ===== VIDEO LOCAL (PiP flotante) ===== */}
                                <div className="webrtc-local-container">
                                    <video
                                        ref={localVideoRef}
                                        autoPlay
                                        muted
                                        playsInline
                                        className="webrtc-video-local"
                                        style={{ display: camaraApagada ? 'none' : 'block' }}
                                    />

                                    {/* Placeholder cuando TU cámara está apagada */}
                                    {camaraApagada && (
                                        <div className="webrtc-local-audio-placeholder">
                                            <span style={{ fontSize: 28 }}>👤</span>
                                            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>Tú</span>
                                        </div>
                                    )}

                                {/* Badges pequeños TU estado en el PiP */}
                                    <div className="webrtc-local-status-badges">
                                        {microfonoMuteado && (
                                            <span className="status-badge-small badge-red-small" title="Estás Silenciado">🎙️❌</span>
                                        )}
                                        {camaraApagada && (
                                            <span className="status-badge-small badge-gray-small" title="Tu cámara está apagada">📹❌</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* ===== INDICADORES REMOTOS — fuera de container, siempre visibles ===== */}
                            {(camaraRemotaApagada || microfonoRemotoMuteado) && (
                                <div style={{
                                    position: 'absolute',
                                    top: 55,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 8,
                                    zIndex: 50,
                                    pointerEvents: 'none'
                                }}>
                                    {camaraRemotaApagada && (
                                        <span className="status-badge badge-red">
                                            📹 {nombreRemoto} tiene la cámara apagada
                                        </span>
                                    )}
                                    {microfonoRemotoMuteado && (
                                        <span className="status-badge badge-red">
                                            🎙️ {nombreRemoto} está silenciado
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Controles Flotantes Inferiores */}
                            <div className="webrtc-controls">
                                <button
                                    className={`webrtc-control-btn ${microfonoMuteado ? "active-red" : ""}`}
                                    onClick={toggleMicrofono}
                                    title={microfonoMuteado ? "Activar micrófono" : "Mutear micrófono"}
                                >
                                    🎙️
                                </button>

                                <button
                                    className={`webrtc-control-btn ${camaraApagada ? "active-red" : ""}`}
                                    onClick={toggleCamara}
                                    title={camaraApagada ? "Activar cámara" : "Apagar cámara"}
                                >
                                    📹
                                </button>

                                <button
                                    className="webrtc-control-btn btn-decline"
                                    onClick={colgar}
                                    title="Colgar"
                                >
                                    📞
                                </button>
                            </div>
                        </div>
                        )
                    })()}
                </div>
            )}
        </div>
    )
}

export default Chat