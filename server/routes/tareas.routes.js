/**
 * tareas.routes.js
 * Rutas del sistema de tareas/logros: progreso, completado y puntos.
 * Tablas involucradas: tarea, usuario_tarea, usuario, V_Tareas_Usuario, V_Tareas
 */

const express = require("express")
const router = express.Router()
const db = require("../db")

// ─── POST /tareas/progreso ───────────────────────────────────────────────────
// Actualizar el progreso de una tarea para un usuario.
// Si se completa, suma los puntos correspondientes al usuario.
router.post("/tareas/progreso", (req, res) => {
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

        // Si la tarea recién se completó, sumar los puntos al usuario
        if (result.changedRows > 0) {
            const sqlPuntos = `
                UPDATE usuario u
                SET u.Puntos = u.Puntos + (
                    SELECT t.Puntos FROM tarea t WHERE t.ID_Tarea = ?
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

// ─── GET /tareas/progreso/:idUsuario ─────────────────────────────────────────
// Obtener el progreso de todas las tareas de un usuario
router.get("/tareas/progreso/:idUsuario", (req, res) => {
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

// ─── GET /tareas/:id ─────────────────────────────────────────────────────────
// Obtener las tareas de un usuario por su ID (usando la vista V_Tareas_Usuario)
router.get("/tareas/:id", (req, res) => {
    const id = req.params.id

    const sql = `SELECT * FROM V_Tareas_Usuario WHERE ID_Us = ?`

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error" })
        }
        res.json(result)
    })
})

// ─── GET /tareas ─────────────────────────────────────────────────────────────
// Obtener todas las tareas disponibles (vista V_Tareas)
router.get("/tareas", (req, res) => {
    const sql = `SELECT * FROM V_Tareas`
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: "Error al obtener tareas" })
        res.json(result)
    })
})

module.exports = router
