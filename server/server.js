require("dotenv").config()

const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")
const path = require("path")

const multer = require("multer")
const fs = require("fs")
const cloudinary = require("cloudinary").v2

// Configurar Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

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

// Storage separado para archivos de mensajes (imágenes + documentos)
const mensajesDir = path.join(__dirname, "uploads", "mensajes")
if (!fs.existsSync(mensajesDir)) fs.mkdirSync(mensajesDir, { recursive: true })

const storageMensajes = multer.diskStorage({
    destination: (req, file, cb) => cb(null, mensajesDir),
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9)
        cb(null, unique + path.extname(file.originalname))
    }
})

const uploadMensaje = multer({
    storage: storageMensajes,
    limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp|pdf|txt|doc|docx|xls|xlsx|zip/
        const ext = allowed.test(path.extname(file.originalname).toLowerCase())
        const mime = [
            "image/jpeg","image/png","image/gif","image/webp",
            "application/pdf","text/plain",
            "application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/zip"
        ].includes(file.mimetype)
        if (ext && mime) return cb(null, true)
        cb(new Error("Tipo de archivo no permitido"))
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

// Endpoint para obtener amigos (solo aceptados, no bloqueados) con información de favorito
app.get("/amigos/:idUsuario", (req, res) => {
    const idUsuario = parseInt(req.params.idUsuario)
    const sql = `
        SELECT 
            u.ID_Us, 
            u.NombreUsuario,
            a.Favorito
        FROM amistad a
        INNER JOIN usuario u ON (
            (a.usuario1 = ? AND a.usuario2 = u.ID_Us) OR
            (a.usuario2 = ? AND a.usuario1 = u.ID_Us)
        )
        WHERE (a.usuario1 = ? OR a.usuario2 = ?) 
        AND a.estado = 'aceptado'
        ORDER BY a.Favorito DESC, u.NombreUsuario ASC
    `
    db.query(sql, [idUsuario, idUsuario, idUsuario, idUsuario], (err, result) => {
        if (err) return res.status(500).json({ error: "Error al obtener amigos" })
        res.json(result)
    })
})

// Endpoint para obtener usuarios bloqueados por el usuario actual
app.get("/bloqueados/:idUsuario", (req, res) => {
    const idUsuario = parseInt(req.params.idUsuario)
    const sql = `
        SELECT 
            u.ID_Us, 
            u.NombreUsuario
        FROM amistad a
        INNER JOIN usuario u ON (
            (a.usuario1 = ? AND a.usuario2 = u.ID_Us) OR
            (a.usuario2 = ? AND a.usuario1 = u.ID_Us)
        )
        WHERE (a.usuario1 = ? OR a.usuario2 = ?) 
        AND a.estado = 'bloqueado'
    `
    db.query(sql, [idUsuario, idUsuario, idUsuario, idUsuario], (err, result) => {
        if (err) return res.status(500).json({ error: "Error al obtener bloqueados" })
        res.json(result)
    })
})

// Endpoint para desbloquear usuario
app.put("/amistad/desbloquear", (req, res) => {
    const { idUsuario, idAmigo } = req.body
    const sql = `
        UPDATE amistad 
        SET estado = 'aceptado' 
        WHERE (usuario1 = ? AND usuario2 = ?) OR (usuario1 = ? AND usuario2 = ?)
        AND estado = 'bloqueado'
    `
    db.query(sql, [idUsuario, idAmigo, idAmigo, idUsuario], (err, result) => {
        if (err) return res.status(500).json({ error: "Error al desbloquear" })
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "No se encontró bloqueo" })
        }
        res.json({ message: "Usuario desbloqueado correctamente" })
    })
})

app.post("/solicitud/enviar", (req, res) => {
    const { idEmisor, idReceptor } = req.body
    const sql = `INSERT INTO amistad (usuario1, usuario2, estado) VALUES (?, ?, 'pendiente')`
    db.query(sql, [idEmisor, idReceptor], (err) => {
        if (err) return res.status(500).json({ error: "Error al enviar solicitud" })
        res.json({ message: "Solicitud enviada" })
        
        // Llamar al endpoint de tareas sin await, en segundo plano
        const port = process.env.PORT || 3000
        fetch(`http://localhost:${port}/tareas/progreso`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                idUsuario: idEmisor, 
                idTarea: 7, // ID de la tarea de login
                incremento: 1
            })
        }).catch(err => console.error("Error actualizando tarea:", err))

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
    
    console.log("Respondiendo a solicitud:", { idAmistad, accion })
    
    // Obtener usuario1 y usuario2
    const sqlGetUsuarios = `SELECT usuario1, usuario2 FROM amistad WHERE ID_Amistad = ?`
    
    db.query(sqlGetUsuarios, [idAmistad], (err, result) => {
        if (err || result.length === 0) {
            return res.status(500).json({ error: "Error al obtener datos" })
        }
        
        const idEmisor = result[0].usuario1
        const idReceptor = result[0].usuario2
        
        let sql
        let params
        
        if (accion === "aceptado") {
            sql = `UPDATE amistad SET estado = 'aceptado' WHERE ID_Amistad = ?`
            params = [idAmistad]
        } else if (accion === "rechazado") {
            // Eliminar la solicitud en lugar de marcarla como rechazada
            sql = `DELETE FROM amistad WHERE ID_Amistad = ?`
            params = [idAmistad]
        } else {
            return res.status(400).json({ error: "Acción no válida" })
        }
        
        db.query(sql, params, (err) => {
            if (err) {
                console.error("Error:", err)
                return res.status(500).json({ error: "Error al responder solicitud" })
            }
            res.json({ message: `Solicitud ${accion}` })
            
            const port = process.env.PORT || 3000
            
            if (accion === "aceptado") {
                fetch(`http://localhost:${port}/tareas/progreso`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        idUsuario: idEmisor, 
                        idTarea: 3,
                        incremento: 1
                    })
                }).catch(err => console.error("Error:", err))
                
                fetch(`http://localhost:${port}/tareas/progreso`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        idUsuario: idReceptor, 
                        idTarea: 3,
                        incremento: 1
                    })
                }).catch(err => console.error("Error:", err))
            }
            
            if (accion === "rechazado") {
                fetch(`http://localhost:${port}/tareas/progreso`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        idUsuario: idReceptor, 
                        idTarea: 8,
                        incremento: 1
                    })
                }).catch(err => console.error("Error:", err))
            }
        })
    })
})

// En server.js - Obtener estado de la amistad (favorito, silenciado)
app.get("/amistad/estado/:idUsuario/:idAmigo", (req, res) => {
    const { idUsuario, idAmigo } = req.params
    
    const sql = `
        SELECT Favorito, Sileciar
        FROM amistad
        WHERE (usuario1 = ? AND usuario2 = ?) OR (usuario1 = ? AND usuario2 = ?)
    `
    db.query(sql, [idUsuario, idAmigo, idAmigo, idUsuario], (err, result) => {
        if (err) return res.status(500).json({ error: "Error" })
        if (result.length === 0) return res.json({ favorito: 0, silenciado: 0 })
        res.json({ 
            favorito: result[0].Favorito || 0,
            silenciado: result[0].Sileciar || 0
        })
    })
})

// Endpoint para marcar/desmarcar favorito
app.put("/amistad/favorito", (req, res) => {
    const { idUsuario, idAmigo, favorito } = req.body
    
    const sql = `
        UPDATE amistad 
        SET Favorito = ? 
        WHERE (usuario1 = ? AND usuario2 = ?) OR (usuario1 = ? AND usuario2 = ?)
    `
    db.query(sql, [favorito ? 1 : 0, idUsuario, idAmigo, idAmigo, idUsuario], (err) => {
        if (err) return res.status(500).json({ error: "Error" })
        res.json({ message: favorito ? "Marcado como favorito" : "Eliminado de favoritos" })
        
        if (favorito) {
            const port = process.env.PORT || 3000
            fetch(`http://localhost:${port}/tareas/progreso`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idUsuario, idTarea: 2, incremento: 1 })
            }).catch(err => console.error("Error:", err))
        }
    })
})

// Endpoint para silenciar/desilenciar
app.put("/amistad/silenciar", (req, res) => {
    const { idUsuario, idAmigo, silenciado } = req.body
    
    const sql = `
        UPDATE amistad 
        SET Sileciar = ? 
        WHERE (usuario1 = ? AND usuario2 = ?) OR (usuario1 = ? AND usuario2 = ?)
    `
    db.query(sql, [silenciado ? 1 : 0, idUsuario, idAmigo, idAmigo, idUsuario], (err) => {
        if (err) return res.status(500).json({ error: "Error" })
        res.json({ message: silenciado ? "Silenciado" : "Silencio desactivado" })
    })
})

// Endpoint para eliminar amigo
app.delete("/amistad/eliminar", (req, res) => {
    const { idUsuario, idAmigo } = req.body
    
    const sql = `
        DELETE FROM amistad 
        WHERE (usuario1 = ? AND usuario2 = ?) OR (usuario1 = ? AND usuario2 = ?)
    `
    db.query(sql, [idUsuario, idAmigo, idAmigo, idUsuario], (err) => {
        if (err) return res.status(500).json({ error: "Error" })
        res.json({ message: "Amigo eliminado" })
    })
})

// Endpoint para bloquear usuario
app.put("/amistad/bloquear", (req, res) => {
    const { idUsuario, idAmigo } = req.body
    
    const sql = `
        UPDATE amistad 
        SET estado = 'bloqueado' 
        WHERE (usuario1 = ? AND usuario2 = ?) OR (usuario1 = ? AND usuario2 = ?)
    `
    db.query(sql, [idUsuario, idAmigo, idAmigo, idUsuario], (err) => {
        if (err) return res.status(500).json({ error: "Error" })
        res.json({ message: "Usuario bloqueado" })
    })
})

// Endpoint para desbloquear usuario
app.put("/amistad/desbloquear", (req, res) => {
    const { idUsuario, idAmigo } = req.body
    
    const sql = `
        UPDATE amistad 
        SET estado = 'aceptado' 
        WHERE (usuario1 = ? AND usuario2 = ?) OR (usuario1 = ? AND usuario2 = ?)
    `
    db.query(sql, [idUsuario, idAmigo, idAmigo, idUsuario], (err, result) => {
        if (err) {
            console.error("Error al desbloquear usuario:", err)
            return res.status(500).json({ error: "Error al desbloquear usuario" })
        }
        
        res.json({ message: "Usuario desbloqueado correctamente" })
    })
})

// Obtener mensajes de un grupo (debe definirse antes del endpoint de mensajes individuales para evitar conflictos de rutas)
app.get("/mensajes/grupo/:idConversacion", (req, res) => {
    const { idConversacion } = req.params;
    const sql = `
        SELECT m.ID_Mensaje, m.mensaje, m.fechaCreacion, m.id_remitente, u.NombreUsuario,
               COALESCE(m.tipo, 'texto') AS tipo, m.archivo
        FROM mensaje m
        INNER JOIN usuario u ON m.id_remitente = u.ID_Us
        WHERE m.id_conversacion = ?
        ORDER BY m.fechaCreacion ASC
    `;
    db.query(sql, [idConversacion], (err, result) => {
        if (err) {
            console.error("Error al obtener mensajes de grupo:", err);
            return res.status(500).json({ error: "Error al obtener mensajes de grupo." });
        }
        res.json(result);
    });
});

app.get("/mensajes/:idUsuario/:idAmigo", (req, res) => {
    const { idUsuario, idAmigo } = req.params;
    
    // Consulta para traer los mensajes de la conversación
    const sqlSelect = `
        SELECT m.ID_Mensaje, m.mensaje, m.fechaCreacion, m.id_remitente,
               COALESCE(m.tipo, 'texto') AS tipo, m.archivo
        FROM mensaje m
        INNER JOIN conversacion c ON m.id_conversacion = c.ID_Conversacion
        INNER JOIN conversacion_usuario cu1 ON cu1.id_conversacion = m.id_conversacion AND cu1.id_usuario = ?
        INNER JOIN conversacion_usuario cu2 ON cu2.id_conversacion = m.id_conversacion AND cu2.id_usuario = ?
        WHERE (c.esGrupo IS NULL OR c.esGrupo = 0)
        ORDER BY m.fechaCreacion ASC
    `
    
    db.query(sqlSelect, [idUsuario, idAmigo], (err, result) => {
        if (err) return res.status(500).json({ error: "Error al obtener mensajes" })
        
        // Marcar como leídos los mensajes que envió el amigo a mí en esta conversación
        const sqlUpdate = `
            UPDATE mensaje m
            INNER JOIN conversacion c ON m.id_conversacion = c.ID_Conversacion
            INNER JOIN conversacion_usuario cu1 ON cu1.id_conversacion = m.id_conversacion AND cu1.id_usuario = ?
            INNER JOIN conversacion_usuario cu2 ON cu2.id_conversacion = m.id_conversacion AND cu2.id_usuario = ?
            SET m.leido = 1
            WHERE m.id_remitente = ? AND m.leido = 0 AND (c.esGrupo IS NULL OR c.esGrupo = 0)
        `
        db.query(sqlUpdate, [idUsuario, idAmigo, idAmigo], (errUpdate) => {
            if (errUpdate) console.error("Error al marcar mensajes como leídos:", errUpdate)
        })

        res.json(result)
    })
})

app.post("/mensajes/enviar", (req, res) => {
    const { idEmisor, idReceptor, contenido } = req.body
    const sqlBuscar = `
        SELECT cu1.id_conversacion FROM conversacion_usuario cu1
        INNER JOIN conversacion_usuario cu2 ON cu1.id_conversacion = cu2.id_conversacion
        INNER JOIN conversacion c ON cu1.id_conversacion = c.ID_Conversacion
        WHERE cu1.id_usuario = ? AND cu2.id_usuario = ? AND (c.esGrupo IS NULL OR c.esGrupo = 0)
        LIMIT 1
    `
    // Verificar si el receptor tiene un socket abierto (está en línea)
    const receptorOnline = usuariosConectados.has(parseInt(idReceptor)) || usuariosConectados.has(String(idReceptor))
    const leido = receptorOnline ? 1 : 0

    db.query(sqlBuscar, [idEmisor, idReceptor], (err, result) => {
        if (err) return res.status(500).json({ error: "Error" })
        if (result.length > 0) {
            insertarMensaje(result[0].id_conversacion, idEmisor, contenido, res, "texto", null, leido)
        } else {
            db.query("INSERT INTO conversacion (esGrupo) VALUES (0)", (err, r) => {
                if (err) return res.status(500).json({ error: "Error al crear conversación" })
                const idCon = r.insertId
                db.query(
                    "INSERT INTO conversacion_usuario (id_conversacion, id_usuario) VALUES (?, ?), (?, ?)",
                    [idCon, idEmisor, idCon, idReceptor],
                    (err) => {
                        if (err) return res.status(500).json({ error: "Error" })
                        insertarMensaje(idCon, idEmisor, contenido, res, "texto", null, leido)
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

// --- ENDPOINTS DE GRUPOS ---

// Crear un grupo
app.post("/grupos/crear", (req, res) => {
    const { nombreGrupo, idCreador, participantes } = req.body; // participantes es un array de IDs [id1, id2, ...]

    // Validación: Creador + Participantes debe ser al menos 3 personas
    const totalMiembros = (participantes ? participantes.length : 0) + 1;
    if (totalMiembros < 3) {
        return res.status(400).json({ error: "Un grupo debe tener al menos 3 integrantes." });
    }

    // 1. Crear la conversación de tipo grupo
    const sqlConversacion = "INSERT INTO conversacion (esGrupo, nombreGrupo, idCreador) VALUES (1, ?, ?)";
    db.query(sqlConversacion, [nombreGrupo, idCreador], (err, r) => {
        if (err) {
            console.error("Error al crear conversación de grupo:", err);
            return res.status(500).json({ error: "Error al crear el grupo." });
        }
        
        const idCon = r.insertId;

        // 2. Preparar los inserts para conversacion_usuario
        // El creador es 'admin', los demás son 'miembro'
        const values = [[idCon, idCreador, 'admin']];
        participantes.forEach(idPart => {
            values.push([idCon, idPart, 'miembro']);
        });

        const sqlMiembros = "INSERT INTO conversacion_usuario (id_conversacion, id_usuario, rol) VALUES ?";
        db.query(sqlMiembros, [values], (err) => {
            if (err) {
                console.error("Error al insertar miembros del grupo:", err);
                return res.status(500).json({ error: "Error al registrar miembros del grupo." });
            }

            const respuesta = { message: "Grupo creado con éxito.", idConversacion: idCon };
            res.json(respuesta);

            // Notificar en tiempo real a todos los participantes para que actualicen su sidebar
            const todosIds = [idCreador, ...participantes];
            todosIds.forEach(idUser => {
                io.to(`user_${idUser}`).emit("grupo_creado", { idConversacion: idCon });
            });
        });
    });
});

// Editar información de un grupo (nombre, foto, banner) — Solo admins/creador
app.put("/grupos/editar/:idConversacion", upload.fields([
    { name: "fotoGrupo", maxCount: 1 },
    { name: "fotoBanner", maxCount: 1 }
]), (req, res) => {
    const { idConversacion } = req.params;
    const { idEjecutor, nombreGrupo } = req.body;

    // Verificar que el ejecutor es admin o creador
    const sqlCheck = `
        SELECT cu.rol, c.idCreador
        FROM conversacion_usuario cu
        INNER JOIN conversacion c ON c.ID_Conversacion = cu.id_conversacion
        WHERE cu.id_conversacion = ? AND cu.id_usuario = ?
    `;
    db.query(sqlCheck, [idConversacion, idEjecutor], (err, result) => {
        if (err) return res.status(500).json({ error: "Error de servidor" });
        if (result.length === 0) return res.status(403).json({ error: "No eres miembro de este grupo." });

        const row = result[0];
        const esCreador = parseInt(idEjecutor) === row.idCreador;
        const esAdmin = row.rol === 'admin';

        if (!esCreador && !esAdmin) {
            return res.status(403).json({ error: "Solo los administradores pueden editar la información del grupo." });
        }

        // Construir los campos a actualizar dinámicamente
        const campos = [];
        const valores = [];

        if (nombreGrupo && nombreGrupo.trim()) {
            campos.push("nombreGrupo = ?");
            valores.push(nombreGrupo.trim());
        }

        if (req.files && req.files["fotoGrupo"]) {
            campos.push("fotoGrupo = ?");
            valores.push("/uploads/" + req.files["fotoGrupo"][0].filename);
        }

        if (req.files && req.files["fotoBanner"]) {
            campos.push("fotoBanner = ?");
            valores.push("/uploads/" + req.files["fotoBanner"][0].filename);
        }

        if (campos.length === 0) {
            return res.status(400).json({ error: "No hay nada que actualizar." });
        }

        valores.push(idConversacion);
        const sqlUpdate = `UPDATE conversacion SET ${campos.join(", ")} WHERE ID_Conversacion = ?`;
        db.query(sqlUpdate, valores, (err) => {
            if (err) {
                console.error("Error al editar grupo:", err);
                return res.status(500).json({ error: "Error al actualizar el grupo." });
            }

            // Devolver la info actualizada del grupo
            db.query("SELECT ID_Conversacion, nombreGrupo, fotoGrupo, fotoBanner, idCreador FROM conversacion WHERE ID_Conversacion = ?", [idConversacion], (err, grupos) => {
                if (err) return res.status(500).json({ error: "Error al obtener grupo actualizado." });
                res.json({ message: "Grupo actualizado correctamente.", grupo: grupos[0] });
            });
        });
    });
});

// Obtener los grupos de un usuario
app.get("/grupos/:idUsuario", (req, res) => {
    const { idUsuario } = req.params;
    const sql = `
        SELECT c.ID_Conversacion, c.nombreGrupo, c.fotoGrupo, c.idCreador, cu.rol
        FROM conversacion c
        INNER JOIN conversacion_usuario cu ON c.ID_Conversacion = cu.id_conversacion
        WHERE cu.id_usuario = ? AND c.esGrupo = 1
    `;
    db.query(sql, [idUsuario], (err, result) => {
        if (err) {
            console.error("Error al obtener grupos:", err);
            return res.status(500).json({ error: "Error al obtener grupos." });
        }
        res.json(result);
    });
});

// Obtener detalles e integrantes de un grupo
app.get("/grupos/detalles/:idConversacion", (req, res) => {
    const { idConversacion } = req.params;
    
    // Obtener info del grupo
    const sqlGrupo = "SELECT ID_Conversacion, nombreGrupo, fotoGrupo, fotoBanner, idCreador, esGrupo FROM conversacion WHERE ID_Conversacion = ? AND esGrupo = 1";
    db.query(sqlGrupo, [idConversacion], (err, grupos) => {
        if (err) return res.status(500).json({ error: "Error al obtener detalles" });
        if (grupos.length === 0) return res.status(404).json({ error: "Grupo no encontrado" });
        
        const grupo = grupos[0];

        // Obtener integrantes
        const sqlMiembros = `
            SELECT u.ID_Us, u.NombreUsuario, u.Foto, cu.rol
            FROM conversacion_usuario cu
            INNER JOIN usuario u ON cu.id_usuario = u.ID_Us
            WHERE cu.id_conversacion = ?
        `;
        db.query(sqlMiembros, [idConversacion], (err, miembros) => {
            if (err) return res.status(500).json({ error: "Error al obtener miembros" });
            res.json({ grupo, miembros });
        });
    });
});

// Agregar miembro al grupo
app.post("/grupos/miembros/agregar", (req, res) => {
    const { idConversacion, idEjecutor, idNuevoMiembro } = req.body;

    // Verificar si el ejecutor es admin o creador en el grupo
    const sqlCheck = "SELECT rol FROM conversacion_usuario WHERE id_conversacion = ? AND id_usuario = ?";
    db.query(sqlCheck, [idConversacion, idEjecutor], (err, result) => {
        if (err) return res.status(500).json({ error: "Error de servidor" });
        if (result.length === 0 || result[0].rol !== 'admin') {
            // Verificar si es el creador directo (por si acaso no tiene el rol de admin por alguna razón)
            const sqlCheckCreador = "SELECT idCreador FROM conversacion WHERE ID_Conversacion = ?";
            return db.query(sqlCheckCreador, [idConversacion], (err, resC) => {
                if (err) return res.status(500).json({ error: "Error" });
                if (resC.length === 0 || resC[0].idCreador !== parseInt(idEjecutor)) {
                    return res.status(403).json({ error: "No tienes permisos para agregar miembros (debes ser administrador)." });
                }
                procederAgregar();
            });
        }
        procederAgregar();

        function procederAgregar() {
            // Insertar al nuevo miembro
            const sqlAdd = "INSERT INTO conversacion_usuario (id_conversacion, id_usuario, rol) VALUES (?, ?, 'miembro') ON DUPLICATE KEY UPDATE rol = 'miembro'";
            db.query(sqlAdd, [idConversacion, idNuevoMiembro], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: "Error al agregar miembro." });
                }
                res.json({ message: "Miembro agregado correctamente." });
                // Notificar a todos en el grupo y al nuevo miembro
                io.to(`grupo_${idConversacion}`).emit("grupo_actualizado", { idConversacion, tipo: "miembro_agregado" });
                io.to(`user_${idNuevoMiembro}`).emit("grupo_creado", { idConversacion });
            });
        }
    });
});

// Eliminar miembro del grupo
app.post("/grupos/miembros/eliminar", (req, res) => {
    const { idConversacion, idEjecutor, idMiembroEliminar } = req.body;

    // Obtener detalles del creador del grupo
    db.query("SELECT idCreador FROM conversacion WHERE ID_Conversacion = ?", [idConversacion], (err, resultG) => {
        if (err) return res.status(500).json({ error: "Error de servidor" });
        if (resultG.length === 0) return res.status(404).json({ error: "Grupo no encontrado" });

        const creadorId = resultG[0].idCreador;

        // No se puede eliminar al creador principal
        if (parseInt(idMiembroEliminar) === creadorId) {
            return res.status(400).json({ error: "No se puede eliminar al creador principal del grupo." });
        }

        // Obtener rol del ejecutor y del miembro a eliminar
        const sqlRoles = "SELECT id_usuario, rol FROM conversacion_usuario WHERE id_conversacion = ? AND id_usuario IN (?, ?)";
        db.query(sqlRoles, [idConversacion, idEjecutor, idMiembroEliminar], (err, resultR) => {
            if (err) return res.status(500).json({ error: "Error" });
            
            const ejecutorRow = resultR.find(r => r.id_usuario === parseInt(idEjecutor));
            const eliminarRow = resultR.find(r => r.id_usuario === parseInt(idMiembroEliminar));

            if (!ejecutorRow) {
                return res.status(403).json({ error: "No perteneces a este grupo." });
            }
            if (!eliminarRow) {
                return res.status(404).json({ error: "El miembro a eliminar no pertenece a este grupo." });
            }

            const esCreador = parseInt(idEjecutor) === creadorId;
            const ejecutorEsAdmin = ejecutorRow.rol === 'admin' || esCreador;
            const eliminarEsAdmin = eliminarRow.rol === 'admin';

            if (!ejecutorEsAdmin) {
                return res.status(403).json({ error: "No tienes permisos de administrador para eliminar miembros." });
            }

            // Si el ejecutor es admin pero NO es el creador, y el miembro a eliminar también es admin: no puede eliminarlo
            if (!esCreador && eliminarEsAdmin) {
                return res.status(403).json({ error: "Un administrador no puede eliminar a otro administrador. Solo el creador principal puede hacerlo." });
            }

            // Proceder a eliminar
            const sqlDelete = "DELETE FROM conversacion_usuario WHERE id_conversacion = ? AND id_usuario = ?";
            db.query(sqlDelete, [idConversacion, idMiembroEliminar], (err) => {
                if (err) return res.status(500).json({ error: "Error al eliminar miembro." });
                res.json({ message: "Miembro eliminado del grupo correctamente." });
                // Notificar al grupo de la actualización
                io.to(`grupo_${idConversacion}`).emit("grupo_actualizado", { idConversacion, tipo: "miembro_eliminado", idMiembro: idMiembroEliminar });
                io.to(`user_${idMiembroEliminar}`).emit("expulsado_grupo", { idConversacion });
            });
        });
    });
});

// Cambiar rol de un miembro (Promover a Admin / Quitar Admin)
app.post("/grupos/roles/cambiar", (req, res) => {
    const { idConversacion, idEjecutor, idMiembro, nuevoRol } = req.body; // nuevoRol es 'admin' o 'miembro'

    if (nuevoRol !== 'admin' && nuevoRol !== 'miembro') {
        return res.status(400).json({ error: "Rol no válido." });
    }

    // Solo el creador principal puede cambiar roles
    db.query("SELECT idCreador FROM conversacion WHERE ID_Conversacion = ?", [idConversacion], (err, resultG) => {
        if (err) return res.status(500).json({ error: "Error" });
        if (resultG.length === 0) return res.status(404).json({ error: "Grupo no encontrado" });

        const creadorId = resultG[0].idCreador;

        if (parseInt(idEjecutor) !== creadorId) {
            return res.status(403).json({ error: "Solo el creador principal del grupo puede cambiar los roles de los miembros." });
        }

        if (parseInt(idMiembro) === creadorId) {
            return res.status(400).json({ error: "No se puede cambiar el rol del creador principal." });
        }

        const sqlUpdate = "UPDATE conversacion_usuario SET rol = ? WHERE id_conversacion = ? AND id_usuario = ?";
        db.query(sqlUpdate, [nuevoRol, idConversacion, idMiembro], (err) => {
            if (err) return res.status(500).json({ error: "Error al actualizar rol." });
            res.json({ message: `Rol actualizado a ${nuevoRol} correctamente.` });
            // Notificar a todos en el grupo del cambio de rol
            io.to(`grupo_${idConversacion}`).emit("grupo_actualizado", { idConversacion, tipo: "rol_cambiado" });
        });
    });
});

// Salirse del grupo
app.post("/grupos/salir", (req, res) => {
    const { idConversacion, idUsuario } = req.body;

    // Verificar si es el creador principal
    db.query("SELECT idCreador FROM conversacion WHERE ID_Conversacion = ?", [idConversacion], (err, resultG) => {
        if (err) return res.status(500).json({ error: "Error" });
        if (resultG.length === 0) return res.status(404).json({ error: "Grupo no encontrado" });

        const creadorId = resultG[0].idCreador;

        if (parseInt(idUsuario) === creadorId) {
            return res.status(400).json({ error: "El creador principal no puede salirse del grupo directamente. Si quieres salir, debes transferir la propiedad del grupo o eliminarlo." });
        }

        const sqlDelete = "DELETE FROM conversacion_usuario WHERE id_conversacion = ? AND id_usuario = ?";
        db.query(sqlDelete, [idConversacion, idUsuario], (err) => {
            if (err) return res.status(500).json({ error: "Error al salir del grupo." });
            res.json({ message: "Has salido del grupo correctamente." });
        });
    });
});


// Enviar un mensaje al grupo
app.post("/mensajes/grupo/enviar", (req, res) => {
    const { idConversacion, idEmisor, contenido } = req.body;
    
    // Validar que pertenezca al grupo antes de enviar
    const sqlCheck = "SELECT 1 FROM conversacion_usuario WHERE id_conversacion = ? AND id_usuario = ?";
    db.query(sqlCheck, [idConversacion, idEmisor], (err, result) => {
        if (err) return res.status(500).json({ error: "Error de servidor" });
        if (result.length === 0) {
            return res.status(403).json({ error: "No eres miembro de este grupo." });
        }
        
        insertarMensaje(idConversacion, idEmisor, contenido, res);
    });
});

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

    if (!req.file) {
        return res.status(400).json({ error: 'No se seleccionó ningún archivo' })
    }

    const fotoUrl = `/uploads/${req.file.filename}`
    
    db.query('UPDATE usuario SET Foto = ? WHERE ID_Us = ?', [fotoUrl, id], (err) => {
        if (err) {
            console.error("Error al guardar foto:", err)
            return res.status(500).json({ error: 'Error al guardar foto' })
        }
        res.json({ fotoUrl })

        // Llamar al endpoint de tareas sin await, en segundo plano
        const port = process.env.PORT || 3000
        fetch(`http://localhost:${port}/tareas/progreso`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                idUsuario: id, 
                idTarea: 5, // ID de la tarea de login
                incremento: 1
            })
        }).catch(err => console.error("Error actualizando tarea:", err))
    })

})

// Endpoint para subir banner
app.post('/upload/banner/:id', upload.single('banner'), (req, res) => {
    const { id } = req.params

    if (!req.file) {
        return res.status(400).json({ error: 'No se seleccionó ningún archivo' })
    }

    const bannerUrl = `/uploads/${req.file.filename}`
    
    db.query('UPDATE usuario SET Banner = ? WHERE ID_Us = ?', [bannerUrl, id], (err) => {
        if (err) {
            console.error("Error al guardar banner:", err)
            return res.status(500).json({ error: 'Error al guardar banner' })
        }
        res.json({ bannerUrl })
        
        // Llamar al endpoint de tareas sin await, en segundo plano
        const port = process.env.PORT || 3000
        fetch(`http://localhost:${port}/tareas/progreso`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                idUsuario: id, 
                idTarea: 6, // ID de la tarea de login
                incremento: 1
            })
        }).catch(err => console.error("Error actualizando tarea:", err))

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
        AND ut.Completada = 0
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

function insertarMensaje(idCon, idEmisor, contenido, res, tipo = "texto", archivo = null, leido = 0) {
    db.query(
        "INSERT INTO mensaje (id_conversacion, id_remitente, mensaje, fechaCreacion, tipo, archivo, leido) VALUES (?, ?, ?, NOW(), ?, ?, ?)",
        [idCon, idEmisor, contenido, tipo, archivo, leido],
        (err) => {
            if (err) return res.status(500).json({ error: "Error al insertar mensaje" })
            res.json({ message: "Mensaje enviado", tipo, archivo, leido })
        }
    )
}

// Función auxiliar para subir a Cloudinary con fallback local
async function subirACloudinaryOFallback(file, folder = "mensajes") {
    const localPath = file.path
    const rutaLocalRelativa = "/uploads/mensajes/" + file.filename

    // Verificar si las credenciales existen
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        console.warn("⚠️ Advertencia: Falta configurar Cloudinary en .env. Se usará almacenamiento local.")
        return rutaLocalRelativa
    }

    try {
        const res = await cloudinary.uploader.upload(localPath, {
            folder: `mundichat/${folder}`,
            resource_type: "auto"
        })
        
        // Intentar borrar archivo temporal local
        try {
            fs.unlinkSync(localPath)
        } catch (errUnlink) {
            console.error("Error al borrar archivo local temporal:", errUnlink)
        }

        console.log("☁️ Archivo subido exitosamente a Cloudinary:", res.secure_url)
        return res.secure_url // Retorna la URL externa HTTPS
    } catch (error) {
        console.error("❌ Error al subir a Cloudinary (usando fallback local):", error)
        return rutaLocalRelativa // Fallback local
    }
}

// ── Enviar archivo en chat privado ────────────────────────────
app.post("/mensajes/archivo", uploadMensaje.single("archivo"), async (req, res) => {
    const { idEmisor, idReceptor } = req.body
    if (!req.file) return res.status(400).json({ error: "No se recibió el archivo" })
    if (!idEmisor || !idReceptor) return res.status(400).json({ error: "Faltan parámetros" })

    const imageTypes = /\.(jpg|jpeg|png|gif|webp)$/i
    const tipo = imageTypes.test(req.file.originalname) ? "imagen" : "archivo"

    // Subir a Cloudinary (o fallback local)
    const urlArchivo = await subirACloudinaryOFallback(req.file)

    // Buscar o crear conversación privada (esGrupo = 0)
    const sqlConv = `
        SELECT id_conversacion FROM conversacion
        WHERE (esGrupo = 0 OR esGrupo IS NULL)
          AND id_conversacion IN (
              SELECT id_conversacion FROM conversacion_usuario WHERE id_usuario = ?
          )
          AND id_conversacion IN (
              SELECT id_conversacion FROM conversacion_usuario WHERE id_usuario = ?
          )
        LIMIT 1
    `
    // Verificar si el receptor tiene un socket abierto (está en línea)
    const receptorOnline = usuariosConectados.has(parseInt(idReceptor)) || usuariosConectados.has(String(idReceptor))
    const leido = receptorOnline ? 1 : 0

    db.query(sqlConv, [idEmisor, idReceptor], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message })

        const insertarYResponder = (idCon) => {
            insertarMensaje(idCon, idEmisor, req.file.originalname, res, tipo, urlArchivo, leido)
            
            // --- ACTUALIZAR TAREA (después de insertar mensaje) ---
            const port = process.env.PORT || 3000
            // idTarea 10 = "Mira!!" (Envia una Foto o Imagen a un chat)
            fetch(`http://localhost:${port}/tareas/progreso`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    idUsuario: idEmisor, 
                    idTarea: 10,        // Ajusta según tu BD
                    incremento: 1
                })
            }).catch(err => console.error("Error actualizando tarea (archivo):", err))
            // -----------------------------------------------------
            // idTarea 14 = "envia más de 6 Fotos a un amigo (1000pts c/u)"
            fetch(`http://localhost:${port}/tareas/progreso`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    idUsuario: idEmisor, 
                    idTarea: 14,        // Ajusta según tu BD
                    incremento: 1
                })
            }).catch(err => console.error("Error actualizando tarea (archivo):", err))
        }

        if (rows.length > 0) {
            insertarYResponder(rows[0].id_conversacion)
        } else {
            db.query("INSERT INTO conversacion (esGrupo) VALUES (0)", (err2, result) => {
                if (err2) return res.status(500).json({ error: err2.message })
                const idCon = result.insertId
                db.query("INSERT INTO conversacion_usuario (id_conversacion, id_usuario) VALUES (?,?),(?,?)",
                    [idCon, idEmisor, idCon, idReceptor],
                    (err3) => {
                        if (err3) return res.status(500).json({ error: err3.message })
                        insertarYResponder(idCon)
                    }
                )
            })
        }
    })
})

// ── Enviar archivo en chat grupal ─────────────────────────────
app.post("/mensajes/grupo/archivo", uploadMensaje.single("archivo"), async (req, res) => {
    const { idConversacion, idEmisor } = req.body
    if (!req.file) return res.status(400).json({ error: "No se recibió el archivo" })
    if (!idConversacion || !idEmisor) return res.status(400).json({ error: "Faltan parámetros" })

    const imageTypes = /\.(jpg|jpeg|png|gif|webp)$/i
    const tipo = imageTypes.test(req.file.originalname) ? "imagen" : "archivo"

    // Subir a Cloudinary (o fallback local)
    const urlArchivo = await subirACloudinaryOFallback(req.file)

    insertarMensaje(idConversacion, idEmisor, req.file.originalname, res, tipo, urlArchivo)
})

// Obtener todos los ítems disponibles
app.get("/items", (req, res) => {
    const sql = "SELECT * FROM item ORDER BY Precio ASC"
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: "Error al obtener ítems" })
        res.json(result)
    })
})

// Comprar un ítem (canjear puntos)
app.post("/comprar", (req, res) => {
    const { idUsuario, idItem } = req.body

    // Verificar puntos suficientes y existencia del ítem
    const sqlCheck = `
        SELECT u.Puntos, i.Precio
        FROM usuario u, item i
        WHERE u.ID_Us = ? AND i.ID_Item = ?
    `
    db.query(sqlCheck, [idUsuario, idItem], (err, result) => {
        if (err) return res.status(500).json({ error: "Error en la compra" })
        if (result.length === 0) return res.status(404).json({ error: "Ítem no encontrado" })

        const { Puntos, Precio } = result[0]
        if (Puntos < Precio) {
            return res.status(400).json({ error: "Puntos insuficientes" })
        }

        // Restar puntos y agregar al inventario del usuario
        const sqlCompra = `
            START TRANSACTION;
            UPDATE usuario SET Puntos = Puntos - ? WHERE ID_Us = ?;
            INSERT INTO usuario_item (id_usuario, id_item) VALUES (?, ?)
            ON DUPLICATE KEY UPDATE equipado = equipado;
            COMMIT;
        `
        // MySQL no permite múltiples sentencias en una sola llamada directamente,
        // lo hacemos en dos pasos con promesa o callbacks anidados.
        db.query("UPDATE usuario SET Puntos = Puntos - ? WHERE ID_Us = ?", [Precio, idUsuario], (errUpdate) => {
            if (errUpdate) return res.status(500).json({ error: "Error al actualizar puntos" })
            db.query("INSERT INTO usuario_item (id_usuario, id_item) VALUES (?, ?) ON DUPLICATE KEY UPDATE equipado = equipado", [idUsuario, idItem], (errInsert) => {
                if (errInsert) {
                    // revertir puntos si falla la inserción
                    db.query("UPDATE usuario SET Puntos = Puntos + ? WHERE ID_Us = ?", [Precio, idUsuario])
                    return res.status(500).json({ error: "Error al agregar al inventario" })
                }
                res.json({ message: "Compra exitosa" })
            })
        })
    })
})

// Obtener inventario del usuario (opcional, para saber qué tiene)
app.get("/inventario/:idUsuario", (req, res) => {
    const { idUsuario } = req.params
    const sql = `
        SELECT i.*, ui.Equipado
        FROM usuario_item ui
        INNER JOIN item i ON ui.id_item = i.ID_Item
        WHERE ui.id_usuario = ?
    `
    db.query(sql, [idUsuario], (err, result) => {
        if (err) return res.status(500).json({ error: "Error al obtener inventario" })
        res.json(result)
    })
})


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

        // --- ENVIAR MENSAJES PENDIENTES ---
        const sqlPendientes = `
            SELECT m.ID_Mensaje, m.id_conversacion, m.id_remitente, m.mensaje, m.tipo, m.archivo, m.fechaCreacion, u.NombreUsuario AS nombreEmisor
            FROM mensaje m
            INNER JOIN conversacion_usuario cu_destino ON m.id_conversacion = cu_destino.id_conversacion
            INNER JOIN usuario u ON m.id_remitente = u.ID_Us
            INNER JOIN conversacion c ON m.id_conversacion = c.ID_Conversacion
            WHERE cu_destino.id_usuario = ? 
              AND m.id_remitente != ?
              AND m.leido = 0
              AND (c.esGrupo = 0 OR c.esGrupo IS NULL)
        `
        db.query(sqlPendientes, [idUsuario, idUsuario], (err, pendingMsgs) => {
            if (err) {
                console.error("Error al obtener mensajes pendientes:", err)
                return
            }

            if (pendingMsgs.length > 0) {
                console.log(`Enviando ${pendingMsgs.length} mensajes pendientes al usuario ${idUsuario}`)
                
                // Emitir todos los mensajes acumulados al usuario
                socket.emit("mensajes_pendientes", pendingMsgs)

                // Marcar como leídos
                const ids = pendingMsgs.map(m => m.ID_Mensaje)
                db.query("UPDATE mensaje SET leido = 1 WHERE ID_Mensaje IN (?)", [ids], (errUpdate) => {
                    if (errUpdate) console.error("Error actualizando estado de leídos:", errUpdate)
                })
            }
        })
    })

    socket.on("check_status", (idUsuario, callback) => {
        const isOnline = usuariosConectados.has(idUsuario)
        if (callback) callback(isOnline)
    })

    socket.on("mensaje", (data) => {
        io.to(`user_${data.idReceptor}`).emit("mensaje", data)
    })

    // Eventos de Sockets para Grupos
    socket.on("join_group", (idConversacion) => {
        socket.join(`grupo_${idConversacion}`)
        console.log(`Socket ${socket.id} se unio al grupo_${idConversacion}`)
    })

    socket.on("leave_group", (idConversacion) => {
        socket.leave(`grupo_${idConversacion}`)
        console.log(`Socket ${socket.id} salio del grupo_${idConversacion}`)
    })

    socket.on("mensaje_grupo", (data) => {
        // Retransmitir mensaje a todos los demas en la sala del grupo
        socket.to(`grupo_${data.idConversacion}`).emit("mensaje_grupo", data)
    })

    // --- EVENTOS SEÑALIZACIÓN WEBRTC (AUDIO Y VIDEOLLAMADA) ---
    socket.on("webrtc-offer", (data) => {
        console.log(`[WebRTC Server] Oferta recibida de: ${usuarioIdActual} para: ${data.to}. Tipo: ${data.tipo}. Emisor: ${data.nombreEmisor}`)
        // data.to es el ID_Us del destinatario en la BD
        socket.broadcast.to(`user_${data.to}`).emit("webrtc-offer", {
            from: usuarioIdActual,
            sdp: data.sdp,
            tipo: data.tipo, // 'audio' o 'video'
            nombreEmisor: data.nombreEmisor,
            nombreReceptor: data.nombreReceptor
        })
    })

    socket.on("webrtc-answer", (data) => {
        console.log(`[WebRTC Server] Respuesta (Answer) recibida de: ${usuarioIdActual} para: ${data.to}`)
        socket.broadcast.to(`user_${data.to}`).emit("webrtc-answer", {
            from: usuarioIdActual,
            sdp: data.sdp
        })
    })

    socket.on("webrtc-ice-candidate", (data) => {
        console.log(`[WebRTC Server] Candidato ICE recibido de: ${usuarioIdActual} para: ${data.to}`)
        socket.broadcast.to(`user_${data.to}`).emit("webrtc-ice-candidate", {
            from: usuarioIdActual,
            candidate: data.candidate
        })
    })

    socket.on("webrtc-toggle-video", (data) => {
        console.log(`[WebRTC Server] Video toggle de: ${usuarioIdActual} para: ${data.to}. Habilitado: ${data.enabled}`)
        socket.broadcast.to(`user_${data.to}`).emit("webrtc-toggle-video", {
            from: usuarioIdActual,
            enabled: data.enabled
        })
    })

    socket.on("webrtc-toggle-audio", (data) => {
        console.log(`[WebRTC Server] Audio toggle de: ${usuarioIdActual} para: ${data.to}. Habilitado: ${data.enabled}`)
        socket.broadcast.to(`user_${data.to}`).emit("webrtc-toggle-audio", {
            from: usuarioIdActual,
            enabled: data.enabled
        })
    })

    socket.on("webrtc-hangup", (data) => {
        console.log(`[WebRTC Server] Colgar (Hangup) recibido de: ${usuarioIdActual} para: ${data.to}`)
        socket.broadcast.to(`user_${data.to}`).emit("webrtc-hangup", {
            from: usuarioIdActual
        })
    })

    socket.on("webrtc-reject", (data) => {
        console.log(`[WebRTC Server] Rechazo de llamada de: ${usuarioIdActual} para: ${data.to}`);
        // Reenviar el evento al destinatario (quien inició la llamada)
        socket.broadcast.to(`user_${data.to}`).emit("webrtc-reject", {
            from: usuarioIdActual
        });
    });


    socket.on("webrtc-busy", (data) => {
        console.log(`[WebRTC Server] Destinatario ocupado: ${usuarioIdActual} para: ${data.to}`)
        socket.broadcast.to(`user_${data.to}`).emit("webrtc-busy", {
            from: usuarioIdActual
        })
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