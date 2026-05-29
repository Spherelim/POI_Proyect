/**
 * server.js
 * Punto de entrada principal del servidor.
 * Solo configura Express, monta las rutas y arranca el servidor.
 * La lógica de cada dominio está en su propio archivo dentro de /routes y /sockets.
 */

require("dotenv").config()

const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")
const path = require("path")

// ─── Rutas ──────────────────────────────────────────────────────────────────
const authRoutes     = require("./routes/auth.routes")
const usuariosRoutes = require("./routes/usuarios.routes")
const amistadRoutes  = require("./routes/amistad.routes")
const mensajesRoutes = require("./routes/mensajes.routes")
const tareasRoutes   = require("./routes/tareas.routes")

// ─── Sockets ────────────────────────────────────────────────────────────────
const { initSocket } = require("./sockets/socket")

// ─── Middleware de uploads ───────────────────────────────────────────────────
const { uploadDir } = require("./middleware/upload")

// ─── App y servidor ─────────────────────────────────────────────────────────
const app = express()
const server = http.createServer(app)

// ─── Middlewares globales ────────────────────────────────────────────────────
app.use(cors())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))

// Cabecera necesaria para evitar la pantalla de advertencia de ngrok
app.use((req, res, next) => {
    res.setHeader("ngrok-skip-browser-warning", "true")
    next()
})

// ─── Archivos estáticos ──────────────────────────────────────────────────────
app.use("/uploads", express.static(uploadDir))
app.use(express.static(path.join(__dirname, "..", process.env.CARPETA)))

// ─── Endpoint de configuración pública ───────────────────────────────────────
// El frontend lo consulta al iniciar para saber a qué URL del túnel conectarse.
// Así no hay que hacer rebuild cuando cambia la URL de Cloudflare/ngrok.
app.get("/config", (req, res) => {
    res.json({
        apiUrl: process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || 3000}`
    })
})

// ─── Rutas de la API ─────────────────────────────────────────────────────────
app.use(authRoutes)
app.use(usuariosRoutes)
app.use(amistadRoutes)
app.use(mensajesRoutes)
app.use(tareasRoutes)

// ─── Fallback SPA ────────────────────────────────────────────────────────────
// Cualquier ruta GET no reconocida devuelve el index.html del frontend (React SPA)
app.use((req, res) => {
    if (req.method === "GET") {
        res.sendFile(path.join(__dirname, "..", process.env.CARPETA, "index.html"))
    } else {
        res.status(404).json({ error: "Ruta no encontrada" })
    }
})

// ─── Socket.IO ───────────────────────────────────────────────────────────────
const io = new Server(server, {
    cors: { origin: "*" }
})
initSocket(io)

// ─── Arranque ────────────────────────────────────────────────────────────────
server.listen(process.env.PORT || 3000, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT || 3000}`)
})