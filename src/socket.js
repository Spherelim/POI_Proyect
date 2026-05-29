import { io } from "socket.io-client"

// La URL se determina así (en orden de prioridad):
// 1. Variable de entorno VITE_API_URL (build de producción)
// 2. window.location.origin (misma URL desde donde se sirvió la app)
// Esto funciona porque el servidor Express sirve el frontend,
// entonces la URL del túnel es la misma para la API y para el frontend.
const API_URL = import.meta.env.VITE_API_URL || window.location.origin

export const socket = io(API_URL, {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000
})

socket.on("connect", () => {
    console.log("Socket conectado a:", API_URL)
    const usuario = JSON.parse(localStorage.getItem("usuario"))
    if (usuario?.id) {
        socket.emit("registrar", usuario.id)
    }
})

socket.on("disconnect", () => {
    console.log("Socket desconectado")
})