/**
 * auth.routes.js
 * Rutas de autenticación: login y registro de usuarios.
 */

const express = require("express")
const router = express.Router()
const db = require("../db")

// ─── POST /login ────────────────────────────────────────────────────────────
router.post("/login", (req, res) => {
    const { nombreUsuario, contrasena } = req.body
    const sql = `
        SELECT u.ID_Us, u.NombreUsuario, p.NombreCompleto
        FROM usuario u
        INNER JOIN persona p ON u.id_per = p.ID_Per
        WHERE u.NombreUsuario = ? AND u.Contraseña = ?
    `
    db.query(sql, [nombreUsuario, contrasena], (err, result) => {
        if (err) return res.status(500).json({ error: "Error al iniciar sesión" })
        if (result.length === 0) return res.status(401).json({ error: "Credenciales incorrectas" })

        const userId = result[0].ID_Us

        res.json({
            token: "token-de-ejemplo",
            user: {
                id: userId,
                nombreUsuario: result[0].NombreUsuario,
                nombreCompleto: result[0].NombreCompleto
            }
        })

        // Actualizar progreso de la tarea de login en segundo plano
        const port = process.env.PORT || 3000
        fetch(`http://localhost:${port}/tareas/progreso`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idUsuario: userId, idTarea: 4, incremento: 1 })
        }).catch(err => console.error("Error actualizando tarea:", err))
    })
})

// ─── POST /register ─────────────────────────────────────────────────────────
router.post("/register", (req, res) => {
    const { nombreCompleto, nombreUsuario, fechaNac, correo, contrasena } = req.body

    const sqlPersona = `INSERT INTO persona (NombreCompleto, FechaNac) VALUES (?, ?)`

    db.query(sqlPersona, [nombreCompleto, fechaNac], (err, result) => {
        if (err) {
            console.error("Error al insertar persona:", err)
            return res.status(500).json({ error: "Error al registrar usuario" })
        }

        const personaId = result.insertId

        // Verificar que el usuario/correo no exista ya
        const verificar = `SELECT * FROM usuario WHERE NombreUsuario = ? OR Correo = ?`
        db.query(verificar, [nombreUsuario, correo], (err, result) => {
            if (err) {
                console.error("Error al verificar usuario:", err)
                return res.status(500).json({ error: "Error al registrar usuario" })
            }
            if (result.length > 0) {
                return res.status(400).json({ error: "Nombre de usuario o correo ya registrado" })
            }
        })

        const sqlUsuario = `
            INSERT INTO usuario (NombreUsuario, Correo, Contraseña, id_per, FechaRegistro)
            VALUES (?, ?, ?, ?, NOW())
        `

        db.query(sqlUsuario, [nombreUsuario, correo, contrasena, personaId], (err, resultUsuario) => {
            if (err) {
                console.error("Error al insertar usuario:", err)
                return res.status(500).json({ error: "Error al registrar usuario" })
            }

            const usuarioId = resultUsuario.insertId

            // Asignar todas las tareas disponibles al nuevo usuario
            const sqlTareas = `INSERT INTO usuario_tarea(id_usuario, id_tarea) SELECT ?, ID_Tarea FROM tarea`
            db.query(sqlTareas, [usuarioId], (err) => {
                if (err) {
                    console.error("Error al asignar tareas:", err)
                    return res.status(500).json({ error: "Error al asignar tareas" })
                }
                return res.status(201).json({ message: "Usuario registrado exitosamente" })
            })
        })
    })
})

module.exports = router
