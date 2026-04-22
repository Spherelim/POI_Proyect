const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")

const app = express()
app.use(cors())

const server = http.createServer(app)

const db = require("./db")

app.use(express.json())

app.post("/register", (req, res) => {
    const {nombreCompleto,nombreUsuario,fechaNac,correo,contrasena} = req.body

    const sqlPersona = `
        INSERT INTO persona (NombreCompleto, FechaNac)
        VALUES (?, ?)
    `

    db.query(sqlPersona, [nombreCompleto, fechaNac], (err, result) => {
        if (err) {
            console.error("Error al insertar persona:", err)
            return res.status(500).json({ error: "Error al registrar usuario" })
        }

        const personaId = result.insertId

        const sqlUsuario = `
            INSERT INTO usuario (NombreUsuario, Correo, Contraseña, id_per)
            VALUES (?, ?, ?, ?)
        `

        db.query(sqlUsuario, [nombreUsuario,correo, contrasena, personaId], (err) => {
            if (err) {
                console.error("Error al insertar usuario:", err)
                return res.status(500).json({ error: "Error al registrar usuario" })
            }
            return res.status(201).json({ message: "Usuario registrado exitosamente" })
        })
    })

})


const io = new Server(server, {
    cors: {
        origin: "*"
    }
})

io.on("connection", (socket) => {
    console.log("Usuario conectado:", socket.id)

    socket.on("mensaje", (data) => {
        io.emit("mensaje", {
            text: data.text,
            type: "left"
        })
    })

    socket.on("call-user", ({to, offer}) => {
        io.to(to).emit("incoming-call", {
            from: socket.id,
            offer
        })
    })

    socket.on("answer-call", ({to, answer}) => {
        io.to(to).emit("call-answered", {
            answer
        })
    })

    socket.on("ice-candidate", ({to, candidate}) => {
        io.to(to).emit("ice-candidate", candidate)
    })
})

server.listen(3000, () => {
    console.log("Servidor en http://localhost:3000")
})