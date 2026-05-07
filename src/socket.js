import { io } from "socket.io-client"

const usuario = JSON.parse(localStorage.getItem("usuario"))
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

export const socket = io(API_URL, {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5
})

socket.on("connect", () => {
    console.log("Socket conectado")
    if (usuario?.id) {
        socket.emit("registrar", usuario.id)
    }
})

socket.on("disconnect", () => {
    console.log("Socket desconectado")
})