/**
 * usuarios.routes.js
 * Rutas relacionadas con el perfil de usuario: detalles, actualización y subida de fotos.
 * Tablas involucradas: usuario, persona
 */

const express = require("express")
const router = express.Router()
const db = require("../db")
const { upload } = require("../middleware/upload")

// ─── GET /usuarios/:id/puntos ────────────────────────────────────────────────
// Obtener los puntos de un usuario
router.get("/usuarios/:id/puntos", (req, res) => {
    const { id } = req.params
    const sql = `SELECT Puntos FROM usuario WHERE ID_Us = ?`
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Error al obtener puntos" })
        if (result.length === 0) return res.status(404).json({ error: "Usuario no encontrado" })
        res.json({ puntos: result[0].Puntos })
    })
})

// ─── GET /usuarios/detalles/:id ──────────────────────────────────────────────
// Obtener todos los detalles del perfil de un usuario
router.get("/usuarios/detalles/:id", (req, res) => {
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
        res.json({ ...result[0], FechaIngreso: result[0].FechaRegistro })
    })
})

// ─── GET /usuarios/:id/foto ──────────────────────────────────────────────────
// Obtener solo la foto de perfil de un usuario
router.get("/usuarios/:id/foto", (req, res) => {
    const { id } = req.params
    const sql = `SELECT Foto FROM usuario WHERE ID_Us = ?`
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Error" })
        res.json({ foto: result[0]?.Foto || null })
    })
})

// ─── PUT /usuarios/actualizar/:id ────────────────────────────────────────────
// Actualizar datos del perfil (nombre, correo, descripción, fecha de nacimiento)
router.put("/usuarios/actualizar/:id", (req, res) => {
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

        // Actualizar tabla persona
        const sqlPersona = `
            UPDATE persona 
            SET NombreCompleto = ?, FechaNac = ?
            WHERE ID_Per = ?
        `
        db.query(sqlPersona, [nombreCompleto, fechaNac, idPer], (err) => {
            if (err) {
                console.error("Error actualizando persona:", err)
                return res.status(500).json({ error: "Error al actualizar datos" })
            }

            // Actualizar tabla usuario (foto y banner se suben por endpoints separados)
            const sqlUsuario = `
                UPDATE usuario 
                SET NombreUsuario = ?, Correo = ?, Descripcion = ?
                WHERE ID_Us = ?
            `
            db.query(sqlUsuario, [nombreUsuario, correo, descripcion, id], (err) => {
                if (err) {
                    console.error("Error actualizando usuario:", err)
                    return res.status(500).json({ error: "Error al actualizar datos" })
                }
                res.json({
                    message: "Datos actualizados correctamente",
                    user: { id, nombreUsuario, nombreCompleto }
                })
            })
        })
    })
})

// ─── POST /upload/foto/:id ───────────────────────────────────────────────────
// Subir foto de perfil
router.post("/upload/foto/:id", upload.single("foto"), (req, res) => {
    const { id } = req.params

    if (!req.file) {
        return res.status(400).json({ error: "No se seleccionó ningún archivo" })
    }

    const fotoUrl = `/uploads/${req.file.filename}`
    db.query("UPDATE usuario SET Foto = ? WHERE ID_Us = ?", [fotoUrl, id], (err) => {
        if (err) {
            console.error("Error al guardar foto:", err)
            return res.status(500).json({ error: "Error al guardar foto" })
        }
        res.json({ fotoUrl })

        // Progreso tarea: subir foto de perfil
        const port = process.env.PORT || 3000
        fetch(`http://localhost:${port}/tareas/progreso`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idUsuario: id, idTarea: 5, incremento: 1 })
        }).catch(err => console.error("Error actualizando tarea:", err))
    })
})

// ─── POST /upload/banner/:id ─────────────────────────────────────────────────
// Subir banner del perfil
router.post("/upload/banner/:id", upload.single("banner"), (req, res) => {
    const { id } = req.params

    if (!req.file) {
        return res.status(400).json({ error: "No se seleccionó ningún archivo" })
    }

    const bannerUrl = `/uploads/${req.file.filename}`
    db.query("UPDATE usuario SET Banner = ? WHERE ID_Us = ?", [bannerUrl, id], (err) => {
        if (err) {
            console.error("Error al guardar banner:", err)
            return res.status(500).json({ error: "Error al guardar banner" })
        }
        res.json({ bannerUrl })

        // Progreso tarea: subir banner
        const port = process.env.PORT || 3000
        fetch(`http://localhost:${port}/tareas/progreso`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idUsuario: id, idTarea: 6, incremento: 1 })
        }).catch(err => console.error("Error actualizando tarea:", err))
    })
})

module.exports = router
