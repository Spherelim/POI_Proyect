import { io } from "socket.io-client"

const usuario = JSON.parse(localStorage.getItem("usuario"))
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

export const socket = io(API_URL)

socket.on("connect", () => {
    if (usuario?.id) {
        socket.emit("registrar", usuario.id)
    }
})