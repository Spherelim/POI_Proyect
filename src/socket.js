import { io } from "socket.io-client"

const usuario = JSON.parse(localStorage.getItem("usuario"))

export const socket = io("http://localhost:3000")

socket.on("connect", () => {
    if (usuario?.id) {
        socket.emit("registrar", usuario.id)
    }
})