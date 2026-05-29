/**
 * mensajes.routes.js
 * Rutas de mensajería entre usuarios.
 * Tablas involucradas: mensaje, conversacion, conversacion_usuario
 */

const express = require("express")
const router = express.Router()
const db = require("../db")

// ─── Helper: insertarMensaje ─────────────────────────────────────────────────
// Inserta un mensaje en una conversación existente
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

// ─── GET /mensajes/:idUsuario/:idAmigo ───────────────────────────────────────
// Obtener todos los mensajes de la conversación entre dos usuarios
router.get("/mensajes/:idUsuario/:idAmigo", (req, res) => {
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

// ─── POST /mensajes/enviar ───────────────────────────────────────────────────
// Enviar un mensaje (crea la conversación si no existe)
router.post("/mensajes/enviar", (req, res) => {
    const { idEmisor, idReceptor, contenido } = req.body

    // Buscar si ya existe una conversación entre ambos
    const sqlBuscar = `
        SELECT cu1.id_conversacion FROM conversacion_usuario cu1
        INNER JOIN conversacion_usuario cu2 ON cu1.id_conversacion = cu2.id_conversacion
        WHERE cu1.id_usuario = ? AND cu2.id_usuario = ?
        LIMIT 1
    `
    db.query(sqlBuscar, [idEmisor, idReceptor], (err, result) => {
        if (err) return res.status(500).json({ error: "Error" })

        if (result.length > 0) {
            // La conversación ya existe: insertar mensaje directamente
            insertarMensaje(result[0].id_conversacion, idEmisor, contenido, res)
        } else {
            // Crear nueva conversación y luego insertar el mensaje
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

    // Progreso tarea: enviar mensaje (sin bloquear la respuesta)
    fetch(`http://localhost:${process.env.PORT || 3000}/tareas/progreso`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idUsuario: idEmisor, idTarea: 1, incremento: 1 })
    }).catch(err => console.error("Error actualizando tarea:", err))
})

module.exports = router
