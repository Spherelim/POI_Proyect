/**
 * socket.js
 * Configuración y eventos de Socket.IO.
 * Maneja: presencia online/offline, mensajes en tiempo real y señalización WebRTC (videollamadas).
 */

// Almacenar usuarios conectados: { idUsuario -> socket.id }
const usuariosConectados = new Map()

/**
 * Inicializa el servidor de sockets y registra todos los eventos.
 * @param {import("socket.io").Server} io - Instancia de Socket.IO
 */
function initSocket(io) {
    io.on("connection", (socket) => {
        console.log("Usuario conectado:", socket.id)
        let usuarioIdActual = null

        // ── Registrar usuario al conectarse ──────────────────────────────────
        socket.on("registrar", (idUsuario) => {
            usuarioIdActual = idUsuario
            socket.join(`user_${idUsuario}`)
            usuariosConectados.set(idUsuario, socket.id)
            socket.broadcast.emit(`user_status_${idUsuario}`, "online")
            console.log(`Usuario ${idUsuario} está online`)
        })

        // ── Consultar si un usuario está conectado ───────────────────────────
        socket.on("check_status", (idUsuario, callback) => {
            const isOnline = usuariosConectados.has(idUsuario)
            if (callback) callback(isOnline)
        })

        // ── Reenviar mensaje a la sala del receptor ──────────────────────────
        socket.on("mensaje", (data) => {
            io.to(`user_${data.idReceptor}`).emit("mensaje", data)
        })

        // ── Señalización WebRTC: iniciar llamada ─────────────────────────────
        socket.on("call-user", ({ to, offer }) => {
            io.to(to).emit("incoming-call", { from: socket.id, offer })
        })

        // ── Señalización WebRTC: responder llamada ───────────────────────────
        socket.on("answer-call", ({ to, answer }) => {
            io.to(to).emit("call-answered", { answer })
        })

        // ── Señalización WebRTC: candidatos ICE ──────────────────────────────
        socket.on("ice-candidate", ({ to, candidate }) => {
            io.to(to).emit("ice-candidate", candidate)
        })

        // ── Desconexión ──────────────────────────────────────────────────────
        socket.on("disconnect", () => {
            if (usuarioIdActual) {
                usuariosConectados.delete(usuarioIdActual)
                socket.broadcast.emit(`user_status_${usuarioIdActual}`, "offline")
                console.log(`Usuario ${usuarioIdActual} está offline`)
            }
            console.log("Usuario desconectado:", socket.id)
        })
    })
}

module.exports = { initSocket }
