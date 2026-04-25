const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")
const path = require("path")

const app = express()
app.use(cors())

app.use((req, res, next) => {
    res.setHeader("ngrok-skip-browser-warning", "true")
    next()
})

const server = http.createServer(app)

const db = require("./db")

app.use(express.json())

app.post("/login", (req, res) => {
    const { nombreUsuario, contrasena } = req.body
    const sql = `
        SELECT u.ID_Us, u.NombreUsuario, p.NombreCompleto
        FROM usuario u
        INNER JOIN persona p ON u.id_per = p.ID_Per
        WHERE u.NombreUsuario = ? AND u.Contraseña = ?
    `
    db.query(sql, [nombreUsuario, contrasena], (err, result) => {
        if(err) return res.status(500).json({ error: "Error al iniciar sesión" })
        if(result.length === 0) return res.status(401).json({ error: "Credenciales incorrectas" })
        res.json({ 
            token: "token-de-ejemplo",
            user: {
                id: result[0].ID_Us,
                nombreUsuario: result[0].NombreUsuario,
                nombreCompleto: result[0].NombreCompleto
            }
        })
    })
})

app.post("/register", (req, res) => {
    const {nombreCompleto,nombreUsuario,fechaNac,correo,contrasena} = req.body
    const sqlPersona = `INSERT INTO persona (NombreCompleto, FechaNac) VALUES (?, ?)`
    db.query(sqlPersona, [nombreCompleto, fechaNac], (err, result) => {
        if (err) {
            console.error("Error al insertar persona:", err)
            return res.status(500).json({ error: "Error al registrar usuario" })
        }
        const personaId = result.insertId
        const sqlUsuario = `INSERT INTO usuario (NombreUsuario, Correo, Contraseña, id_per) VALUES (?, ?, ?, ?)`
        db.query(sqlUsuario, [nombreUsuario, correo, contrasena, personaId], (err) => {
            if (err) {
                console.error("Error al insertar usuario:", err)
                return res.status(500).json({ error: "Error al registrar usuario" })
            }
            return res.status(201).json({ message: "Usuario registrado exitosamente" })
        })
    })
})

app.get("/usuarios/buscar", (req, res) => {
    const { q, idUsuario } = req.query
    const sql = `
        SELECT u.ID_Us, u.NombreUsuario,
            (SELECT estado FROM amistad 
             WHERE (usuario1 = ? AND usuario2 = u.ID_Us)
             OR (usuario1 = u.ID_Us AND usuario2 = ?)
             LIMIT 1) AS estadoAmistad
        FROM usuario u
        WHERE u.NombreUsuario LIKE ? AND u.ID_Us != ?
    `
    db.query(sql, [idUsuario, idUsuario, `%${q}%`, idUsuario], (err, result) => {
        if (err) return res.status(500).json({ error: "Error al buscar" })
        res.json(result)
    })
})

app.get("/amigos/:idUsuario", (req, res) => {
    const idUsuario = parseInt(req.params.idUsuario)
    const sql = `
        SELECT u.ID_Us, u.NombreUsuario
        FROM amistad a
        INNER JOIN usuario u ON (
            (a.usuario1 = ? AND a.usuario2 = u.ID_Us) OR
            (a.usuario2 = ? AND a.usuario1 = u.ID_Us)
        )
        WHERE (a.usuario1 = ? OR a.usuario2 = ?) AND a.estado = 'aceptado'
    `
    db.query(sql, [idUsuario, idUsuario, idUsuario, idUsuario], (err, result) => {
        if (err) return res.status(500).json({ error: "Error al obtener amigos" })
        res.json(result)
    })
})

app.post("/solicitud/enviar", (req, res) => {
    const { idEmisor, idReceptor } = req.body
    const sql = `INSERT INTO amistad (usuario1, usuario2, estado) VALUES (?, ?, 'pendiente')`
    db.query(sql, [idEmisor, idReceptor], (err) => {
        if (err) return res.status(500).json({ error: "Error al enviar solicitud" })
        res.json({ message: "Solicitud enviada" })
    })
})

app.get("/solicitudes/:idUsuario", (req, res) => {
    const { idUsuario } = req.params
    const sql = `
        SELECT a.ID_Amistad, u.ID_Us, u.NombreUsuario
        FROM amistad a
        INNER JOIN usuario u ON a.usuario1 = u.ID_Us
        WHERE a.usuario2 = ? AND a.estado = 'pendiente'
    `
    db.query(sql, [idUsuario], (err, result) => {
        if (err) return res.status(500).json({ error: "Error al obtener solicitudes" })
        res.json(result)
    })
})

app.put("/solicitud/responder", (req, res) => {
    const { idAmistad, accion } = req.body
    const sql = `UPDATE amistad SET estado = ? WHERE ID_Amistad = ?`
    db.query(sql, [accion, idAmistad], (err) => {
        if (err) return res.status(500).json({ error: "Error al responder solicitud" })
        res.json({ message: `Solicitud ${accion}` })
    })
})

app.get("/mensajes/:idUsuario/:idAmigo", (req, res) => {
    const { idUsuario, idAmigo } = req.params
    const sql = `
        SELECT m.ID_Mensaje, m.mensaje, m.fechaCreacion, m.id_remitente
        FROM mensaje m
        INNER JOIN conversacion_usuario cu1 ON cu1.id_conversacion = m.id_conversacion AND cu1.id_usuario = ?
        INNER JOIN conversacion_usuario cu2 ON cu2.id_conversacion = m.id_conversacion AND cu2.id_usuario = ?
        ORDER BY m.fechaCreacion ASC
    `
    db.query(sql, [idUsuario, idAmigo], (err, result) => {
        if (err) return res.status(500).json({ error: "Error al obtener mensajes" })
        res.json(result)
    })
})

app.post("/mensajes/enviar", (req, res) => {
    const { idEmisor, idReceptor, contenido } = req.body
    const sqlBuscar = `
        SELECT cu1.id_conversacion FROM conversacion_usuario cu1
        INNER JOIN conversacion_usuario cu2 ON cu1.id_conversacion = cu2.id_conversacion
        WHERE cu1.id_usuario = ? AND cu2.id_usuario = ?
        LIMIT 1
    `
    db.query(sqlBuscar, [idEmisor, idReceptor], (err, result) => {
        if (err) return res.status(500).json({ error: "Error" })
        if (result.length > 0) {
            insertarMensaje(result[0].id_conversacion, idEmisor, contenido, res)
        } else {
            db.query("INSERT INTO conversacion () VALUES ()", (err, r) => {
                if (err) return res.status(500).json({ error: "Error al crear conversación" })
                const idCon = r.insertId
                db.query(
                    "INSERT INTO conversacion_usuario (id_conversacion, id_usuario) VALUES (?, ?), (?, ?)",
                    [idCon, idEmisor, idCon, idReceptor],
                    (err) => {
                        if (err) return res.status(500).json({ error: "Error" })
                        insertarMensaje(idCon, idEmisor, contenido, res)
                    }
                )
            })
        }
    })
})

function insertarMensaje(idCon, idEmisor, contenido, res) {
    db.query(
        "INSERT INTO mensaje (id_conversacion, id_remitente, mensaje, fechaCreacion) VALUES (?, ?, ?, NOW())",
        [idCon, idEmisor, contenido],
        (err) => {
            if (err) return res.status(500).json({ error: "Error al insertar mensaje" })
            res.json({ message: "Mensaje enviado" })
        }
    )
}

app.use(express.static(path.join(__dirname, "..", "dist")))

// ✅ Corregido para Express 5: usar /{*path} en lugar de *
app.get("/{*path}", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "dist", "index.html"))
})

const io = new Server(server, {
    cors: { origin: "*" }
})

io.on("connection", (socket) => {
    console.log("Usuario conectado:", socket.id)

    socket.on("registrar", (idUsuario) => {
        socket.join(`user_${idUsuario}`)
    })

    socket.on("mensaje", (data) => {
        io.to(`user_${data.idReceptor}`).emit("mensaje", data)
    })

    socket.on("call-user", ({to, offer}) => {
        io.to(to).emit("incoming-call", { from: socket.id, offer })
    })

    socket.on("answer-call", ({to, answer}) => {
        io.to(to).emit("call-answered", { answer })
    })

    socket.on("ice-candidate", ({to, candidate}) => {
        io.to(to).emit("ice-candidate", candidate)
    })
})

server.listen(3000, () => {
    console.log("Servidor en http://localhost:3000")
})