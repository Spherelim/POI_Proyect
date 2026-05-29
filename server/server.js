require("dotenv").config()

const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")
const path = require("path")

const multer = require("multer")
const fs = require("fs")

const uploadDir = path.join(__dirname, "uploads")
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir,{ recursive: true })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
        const mimetype = allowedTypes.test(file.mimetype)
        if (extname && mimetype) {
            return cb(null, true)
        } else {
            cb(new Error("Solo se permiten imágenes"))
        }
    }
})

const app = express()
app.use(cors())

app.use((req, res, next) => {
    res.setHeader("ngrok-skip-browser-warning", "true")
    next()
})

const server = http.createServer(app)

const db = require("./db")

// app.use(express.json())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

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
        
        const userId = result[0].ID_Us
        
        res.json({ 
            token: "token-de-ejemplo",
            user: {
                id: userId,
                nombreUsuario: result[0].NombreUsuario,
                nombreCompleto: result[0].NombreCompleto
            }
        })
        
        // Llamar al endpoint de tareas sin await, en segundo plano
        const port = process.env.PORT || 3000
        fetch(`http://localhost:${port}/tareas/progreso`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                idUsuario: userId, 
                idTarea: 4, // ID de la tarea de login
                incremento: 1
            })
        }).catch(err => console.error("Error actualizando tarea:", err))
    })
})

app.post("/register", (req, res) => {

    const {
        nombreCompleto,
        nombreUsuario,
        fechaNac,
        correo,
        contrasena
    } = req.body

    const sqlPersona = `
    INSERT INTO persona (NombreCompleto, FechaNac)
    VALUES (?, ?)
    `

    db.query(sqlPersona, [nombreCompleto, fechaNac], (err, result) => {

        if (err) {
            console.error("Error al insertar persona:", err)

            return res.status(500).json({
                error: "Error al registrar usuario"
            })
        }

        const personaId = result.insertId

        const verificar = `
        SELECT *
        FROM usuario
        WHERE NombreUsuario = ?
        OR Correo = ?
        `

        db.query(verificar, [nombreUsuario, correo], (err, result) => {

            if(err){
                console.error("Error al verificar usuario:", err)
                return res.status(500).json({
                    error:"Error al registrar usuario"
                })
            }
            if(result.length > 0){
                return res.status(400).json({
                    error:"Nombre de usuario o correo ya registrado"
                })
            }
        })

        const sqlUsuario = `
            INSERT INTO usuario (
                NombreUsuario,
                Correo,
                Contraseña,
                id_per,
                FechaRegistro
            )
            VALUES (?, ?, ?, ?, NOW())
        `

        db.query(
            sqlUsuario,
            [nombreUsuario, correo, contrasena, personaId],

            (err, resultUsuario) => {

                if (err) {

                    console.error("Error al insertar usuario:", err)

                    return res.status(500).json({
                        error: "Error al registrar usuario"
                    })
                }

                // ID DEL USUARIO
                const usuarioId = resultUsuario.insertId

                // INSERTAR TODAS LAS TAREAS
                const sqlTareas = `
                INSERT INTO usuario_tarea(id_usuario,id_tarea)

                SELECT ?, ID_Tarea
                FROM tarea
                `

                db.query(sqlTareas, [usuarioId], (err) => {

                    if(err){

                        console.error("Error al asignar tareas:", err)

                        return res.status(500).json({
                            error:"Error al asignar tareas"
                        })

                    }

                    return res.status(201).json({
                        message:"Usuario registrado exitosamente"
                    })

                })

            }
        )
    })
})

// app.post("/register", (req, res) => {
//     const {nombreCompleto,nombreUsuario,fechaNac,correo,contrasena} = req.body
//     const sqlPersona = `INSERT INTO persona (NombreCompleto, FechaNac) VALUES (?, ?)`
//     db.query(sqlPersona, [nombreCompleto, fechaNac], (err, result) => {
//         if (err) {
//             console.error("Error al insertar persona:", err)
//             return res.status(500).json({ error: "Error al registrar usuario" })
//         }
//         const personaId = result.insertId
//         const sqlUsuario = `INSERT INTO usuario (NombreUsuario, Correo, Contraseña, id_per) VALUES (?, ?, ?, ?)`
//         db.query(sqlUsuario, [nombreUsuario, correo, contrasena, personaId], (err) => {
//             if (err) {
//                 console.error("Error al insertar usuario:", err)
//                 return res.status(500).json({ error: "Error al registrar usuario" })
//             }
//             return res.status(201).json({ message: "Usuario registrado exitosamente" })
//         })
//     })
// })

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
    
    // Activar tarea de mensaje (después de insertar)
    fetch(`http://localhost:${process.env.PORT || 3000}/tareas/progreso`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            idUsuario: idEmisor, 
            idTarea: 1, // ID de la tarea de enviar mensaje
            incremento: 1
        })
    }).catch(err => console.error("Error actualizando tarea:", err))
})

app.get("/usuarios/:id/puntos", (req, res) => {
    const { id } = req.params
    const sql = `SELECT Puntos FROM usuario WHERE ID_Us = ?`
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Error al obtener puntos" })
        if (result.length === 0) return res.status(404).json({ error: "Usuario no encontrado" })
        res.json({ puntos: result[0].Puntos })
    })
})

app.get("/usuarios/detalles/:id", (req, res) => {
    const { id } = req.params
    const sql = `
        SELECT 
            u.ID_Us,
            u.NombreUsuario,
            u.Correo,
            u.Foto,
            u.Banner,
            u.Puntos,
            u.FechaRegistro,
            u.Descripcion,
            p.NombreCompleto,
            p.FechaNac
        FROM usuario u
        INNER JOIN persona p ON u.id_per = p.ID_Per
        WHERE u.ID_Us = ?
    `
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error:", err)
            return res.status(500).json({ error: "Error al obtener datos del usuario" })
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" })
        }
        
        res.json({
            ...result[0],
            FechaIngreso: result[0].FechaRegistro
        })
    })
})

// Endpoint para subir foto
app.post('/upload/foto/:id', upload.single('foto'), (req, res) => {
    const { id } = req.params
    const fotoUrl = `/uploads/${req.file.filename}`
    
    db.query('UPDATE usuario SET Foto = ? WHERE ID_Us = ?', [fotoUrl, id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al guardar foto' })
        res.json({ fotoUrl })
    })
})

// Endpoint para subir banner
app.post('/upload/banner/:id', upload.single('banner'), (req, res) => {
    const { id } = req.params
    const bannerUrl = `/uploads/${req.file.filename}`
    
    db.query('UPDATE usuario SET Banner = ? WHERE ID_Us = ?', [bannerUrl, id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al guardar banner' })
        res.json({ bannerUrl })
    })
})

// Endpoint para actualizar usuario
app.put("/usuarios/actualizar/:id", (req, res) => {
    const { id } = req.params
    const { nombreUsuario, nombreCompleto, correo, fechaNac, descripcion } = req.body
    
    // Primero obtener el id_per del usuario
    const getIdPer = `SELECT id_per FROM usuario WHERE ID_Us = ?`
    
    db.query(getIdPer, [id], (err, result) => {
        if (err) {
            console.error("Error obteniendo id_per:", err)
            return res.status(500).json({ error: "Error al actualizar datos" })
        }
        
        if (result.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" })
        }
        
        const idPer = result[0].id_per
        
        // Actualizar persona
        const sqlPersona = `
            UPDATE persona 
            SET NombreCompleto = ?,
                FechaNac = ?
            WHERE ID_Per = ?
        `
        
        db.query(sqlPersona, [nombreCompleto, fechaNac, idPer], (err) => {
            if (err) {
                console.error("Error actualizando persona:", err)
                return res.status(500).json({ error: "Error al actualizar datos" })
            }
            
            // Actualizar usuario (sin foto y banner que ya se subieron aparte)
            const sqlUsuario = `
                UPDATE usuario 
                SET NombreUsuario = ?,
                    Correo = ?,
                    Descripcion = ?
                WHERE ID_Us = ?
            `
            
            db.query(sqlUsuario, [nombreUsuario, correo, descripcion, id], (err) => {
                if (err) {
                    console.error("Error actualizando usuario:", err)
                    return res.status(500).json({ error: "Error al actualizar datos" })
                }
                
                res.json({ 
                    message: "Datos actualizados correctamente",
                    user: {
                        id: id,
                        nombreUsuario: nombreUsuario,
                        nombreCompleto: nombreCompleto
                    }
                })
            })
        })
    })
})

// // Endpoint para obtener datos completos del usuario (incluyendo descripción si la agregas)
// app.get("/usuarios/detalles/:id", (req, res) => {
//     const { id } = req.params
//     const sql = `
//         SELECT 
//             u.ID_Us,
//             u.NombreUsuario,
//             u.Correo,
//             u.Foto,
//             u.Banner,
//             u.Puntos,
//             u.FechaRegistro,
//             u.Descripcion,
//             p.NombreCompleto,
//             p.FechaNac
//         FROM usuario u
//         INNER JOIN persona p ON u.id_per = p.ID_Per
//         WHERE u.ID_Us = ?
//     `
//     db.query(sql, [id], (err, result) => {
//         if (err) {
//             console.error("Error:", err)
//             return res.status(500).json({ error: "Error al obtener datos del usuario" })
//         }
//         if (result.length === 0) {
//             return res.status(404).json({ error: "Usuario no encontrado" })
//         }
        
//         res.json({
//             ...result[0],
//             FechaIngreso: result[0].FechaRegistro,
//             descripcion: "Hola, estoy usando MundiChat!" // Puedes agregar una columna descripcion a la BD
//         })
//     })
// })

// Endpoint para obtener solo la foto del usuario
app.get("/usuarios/:id/foto", (req, res) => {
    const { id } = req.params
    const sql = `SELECT Foto FROM usuario WHERE ID_Us = ?`
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Error" })
        res.json({ foto: result[0]?.Foto || null })
    })
})

// Endpoint para actualizar progreso de tarea
app.post("/tareas/progreso", (req, res) => {
    const { idUsuario, idTarea, incremento = 1 } = req.body
    
    console.log("Actualizando tarea:", { idUsuario, idTarea, incremento })
    
    const sql = `
        UPDATE usuario_tarea ut
        INNER JOIN tarea t ON ut.id_tarea = t.ID_Tarea
        SET ut.Progreso = ut.Progreso + ?,
            ut.Completada = CASE 
                WHEN ut.Progreso + ? >= t.Objetivo AND ut.Completada = 0 THEN 1 
                ELSE ut.Completada 
            END
        WHERE ut.id_usuario = ? 
        AND ut.id_tarea = ?
    `
    
    db.query(sql, [incremento, incremento, idUsuario, idTarea], (err, result) => {
        if (err) {
            console.error("Error actualizando progreso:", err)
            return res.status(500).json({ error: "Error al actualizar progreso" })
        }
        
        console.log("Resultado update:", result)
        
        // Si se completó, sumar puntos
        if (result.changedRows > 0) {
            const sqlPuntos = `
                UPDATE usuario u
                SET u.Puntos = u.Puntos + (
                    SELECT t.Puntos
                    FROM tarea t
                    WHERE t.ID_Tarea = ?
                )
                WHERE u.ID_Us = ?
            `
            db.query(sqlPuntos, [idTarea, idUsuario], (err2) => {
                if (err2) console.error("Error sumando puntos:", err2)
            })
        }
        
        res.json({ 
            message: "Progreso actualizado",
            completada: result.changedRows > 0
        })
    })
})

// Endpoint para obtener progreso de tareas del usuario
app.get("/tareas/progreso/:idUsuario", (req, res) => {
    const { idUsuario } = req.params
    
    const sql = `
        SELECT 
            t.ID_Tarea,
            t.Titulo,
            t.Descripcion,
            t.Objetivo,
            t.Puntos,
            IF(t.EsDiario = 0, 'Una vez', 'Diario') AS Frecuencia,
            COALESCE(ut.Progreso, 0) AS Progreso,
            COALESCE(ut.Completada, 0) AS Completada
        FROM tarea t
        LEFT JOIN usuario_tarea ut ON t.ID_Tarea = ut.id_tarea AND ut.id_usuario = ?
        ORDER BY ut.Completada ASC, t.Objetivo DESC
    `
    
    db.query(sql, [idUsuario], (err, result) => {
        if (err) return res.status(500).json({ error: err.message })
        res.json(result)
    })
})
app.get("/tareas/:id",(req,res)=>{

    const id = req.params.id

    const sql = `
    SELECT *
    FROM V_Tareas_Usuario
    WHERE ID_Us = ?
    `

    db.query(sql,[id],(err,result)=>{

        if(err){
            return res.status(500).json({
                error:"Error"
            })
        }

        res.json(result)

    })

})

app.get("/tareas", (req, res) => {

    const sql = `SELECT * FROM V_Tareas`
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: "Error al obtener tareas" })
        res.json(result)
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

// Servir archivos estáticos de uploads
app.use('/uploads', express.static(uploadDir))

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, "..", process.env.CARPETA)))

// Para SPA - cualquier ruta no encontrada envía index.html
app.use((req, res) => {
    if (req.method === "GET") {
        res.sendFile(path.join(__dirname, "..", process.env.CARPETA, "index.html"))
    } else {
        res.status(404).json({ error: "Ruta no encontrada" })
    }
})

const io = new Server(server, {
    cors: { origin: "*" }
})

// Almacenar usuarios conectados
const usuariosConectados = new Map()

io.on("connection", (socket) => {
    console.log("Usuario conectado:", socket.id)
    let usuarioIdActual = null

    socket.on("registrar", (idUsuario) => {
        usuarioIdActual = idUsuario
        socket.join(`user_${idUsuario}`)
        
        usuariosConectados.set(idUsuario, socket.id)
        
        socket.broadcast.emit(`user_status_${idUsuario}`, "online")
        console.log(`Usuario ${idUsuario} está online`)
    })

    socket.on("check_status", (idUsuario, callback) => {
        const isOnline = usuariosConectados.has(idUsuario)
        if (callback) callback(isOnline)
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

    socket.on("disconnect", () => {
        if (usuarioIdActual) {
            usuariosConectados.delete(usuarioIdActual)
            socket.broadcast.emit(`user_status_${usuarioIdActual}`, "offline")
            console.log(`Usuario ${usuarioIdActual} está offline`)
        }
        console.log("Usuario desconectado:", socket.id)
    })
})

server.listen(process.env.PORT || 3000, () => {
    console.log("Servidor en " + (process.env.PORT || 3000))
})