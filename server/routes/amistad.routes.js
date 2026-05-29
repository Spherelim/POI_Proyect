/**
 * amistad.routes.js
 * Rutas relacionadas con amistades: solicitudes, bloqueos, favoritos y silenciado.
 * Tablas involucradas: amistad, usuario
 */

const express = require("express")
const router = express.Router()
const db = require("../db")

// ─── GET /usuarios/buscar ────────────────────────────────────────────────────
// Buscar usuarios por nombre (con estado de amistad incluido)
router.get("/usuarios/buscar", (req, res) => {
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

// ─── GET /amigos/:idUsuario ──────────────────────────────────────────────────
// Obtener amigos aceptados (no bloqueados) con información de favorito
router.get("/amigos/:idUsuario", (req, res) => {
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

// ─── GET /bloqueados/:idUsuario ──────────────────────────────────────────────
// Obtener usuarios bloqueados por el usuario actual
router.get("/bloqueados/:idUsuario", (req, res) => {
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

// ─── POST /solicitud/enviar ──────────────────────────────────────────────────
// Enviar solicitud de amistad
router.post("/solicitud/enviar", (req, res) => {
    const { idEmisor, idReceptor } = req.body
    const sql = `INSERT INTO amistad (usuario1, usuario2, estado) VALUES (?, ?, 'pendiente')`
    db.query(sql, [idEmisor, idReceptor], (err) => {
        if (err) return res.status(500).json({ error: "Error al enviar solicitud" })
        res.json({ message: "Solicitud enviada" })

        // Progreso tarea: enviar solicitud de amistad
        const port = process.env.PORT || 3000
        fetch(`http://localhost:${port}/tareas/progreso`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idUsuario: idEmisor, idTarea: 7, incremento: 1 })
        }).catch(err => console.error("Error actualizando tarea:", err))
    })
})

// ─── GET /solicitudes/:idUsuario ─────────────────────────────────────────────
// Obtener solicitudes de amistad pendientes recibidas
router.get("/solicitudes/:idUsuario", (req, res) => {
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

// ─── PUT /solicitud/responder ────────────────────────────────────────────────
// Aceptar o rechazar una solicitud de amistad
router.put("/solicitud/responder", (req, res) => {
    const { idAmistad, accion } = req.body

    console.log("Respondiendo a solicitud:", { idAmistad, accion })

    const sqlGetUsuarios = `SELECT usuario1, usuario2 FROM amistad WHERE ID_Amistad = ?`
    db.query(sqlGetUsuarios, [idAmistad], (err, result) => {
        if (err || result.length === 0) {
            return res.status(500).json({ error: "Error al obtener datos" })
        }

        const idEmisor = result[0].usuario1
        const idReceptor = result[0].usuario2

        let sql, params

        if (accion === "aceptado") {
            sql = `UPDATE amistad SET estado = 'aceptado' WHERE ID_Amistad = ?`
            params = [idAmistad]
        } else if (accion === "rechazado") {
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
                // Progreso tarea: amistad aceptada para ambos
                fetch(`http://localhost:${port}/tareas/progreso`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ idUsuario: idEmisor, idTarea: 3, incremento: 1 })
                }).catch(err => console.error("Error:", err))

                fetch(`http://localhost:${port}/tareas/progreso`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ idUsuario: idReceptor, idTarea: 3, incremento: 1 })
                }).catch(err => console.error("Error:", err))
            }

            if (accion === "rechazado") {
                fetch(`http://localhost:${port}/tareas/progreso`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ idUsuario: idReceptor, idTarea: 8, incremento: 1 })
                }).catch(err => console.error("Error:", err))
            }
        })
    })
})

// ─── GET /amistad/estado/:idUsuario/:idAmigo ─────────────────────────────────
// Obtener estado de la amistad (favorito, silenciado)
router.get("/amistad/estado/:idUsuario/:idAmigo", (req, res) => {
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

// ─── PUT /amistad/favorito ───────────────────────────────────────────────────
// Marcar o desmarcar como favorito
router.put("/amistad/favorito", (req, res) => {
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

// ─── PUT /amistad/silenciar ──────────────────────────────────────────────────
// Silenciar o desilenciar a un amigo
router.put("/amistad/silenciar", (req, res) => {
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

// ─── DELETE /amistad/eliminar ────────────────────────────────────────────────
// Eliminar a un amigo
router.delete("/amistad/eliminar", (req, res) => {
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

// ─── PUT /amistad/bloquear ───────────────────────────────────────────────────
// Bloquear a un usuario
router.put("/amistad/bloquear", (req, res) => {
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

// ─── PUT /amistad/desbloquear ────────────────────────────────────────────────
// Desbloquear a un usuario
router.put("/amistad/desbloquear", (req, res) => {
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

module.exports = router
