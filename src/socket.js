import { io } from "socket.io-client"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost" + (import.meta.env.VITE_API_PORT || ":3000")

export const socket = io(API_URL, {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5
})

socket.on("connect", () => {
    console.log("Socket conectado")
    // Obtener el usuario de forma dinámica en cada conexión/reconexión
    const usuarioActual = JSON.parse(localStorage.getItem("usuario"))
    if (usuarioActual?.id) {
        socket.emit("registrar", usuarioActual.id)
    }
})

socket.on("disconnect", () => {
    console.log("Socket desconectado")
})