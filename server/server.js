const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")

const app = express()
app.use(cors())

const server = http.createServer(app)

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