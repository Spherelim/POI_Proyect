import "./ChatInput.css"
import { useState, useRef } from "react"
import { toast } from "react-toastify"

import MultimediaIcon from "/src/assets/icons/chat/agregar (w).png"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

function ChatInput({ mensaje, setMensaje, enviarMensaje, onArchivoEnviado, amigoActivo, usuarioId, encriptarMensajes, setEncriptarMensajes }) {

    // Archivo seleccionado pero aún NO enviado
    const [archivoSel, setArchivoSel] = useState(null) // { file, previewUrl, tipo, nombre }
    const [subiendo, setSubiendo] = useState(false)
    const fileRef = useRef(null)

    // 1. Usuario selecciona archivo → solo muestra preview, NO sube todavía
    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return

        const TIPOS_IMAGEN_PERMITIDOS = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/webp",
            "image/avif"
        ]
        const TIPOS_DOC_PERMITIDOS = [
            "application/pdf",
            "text/plain"
        ]

        const esImagen = TIPOS_IMAGEN_PERMITIDOS.includes(file.type)
        const esDoc = TIPOS_DOC_PERMITIDOS.includes(file.type)

        if (!esImagen && !esDoc) {
            toast.error(`Tipo de archivo no permitido. Solo se aceptan imágenes (JPG, PNG, GIF, WEBP, AVIF) y documentos (PDF, TXT).`)
            e.target.value = ""
            return
        }

        const MAX_FILE_SIZE_MB = 10
        const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
        if (file.size > MAX_FILE_SIZE_BYTES) {
            const tamanioMB = (file.size / 1024 / 1024).toFixed(1)
            toast.error(`El archivo pesa ${tamanioMB} MB. El máximo permitido es ${MAX_FILE_SIZE_MB} MB.`)
            e.target.value = ""
            return
        }

        setArchivoSel({
            file,
            previewUrl: esImagen ? URL.createObjectURL(file) : null,
            tipo: esImagen ? "imagen" : "archivo",
            nombre: file.name
        })
        // Limpia el input para poder reseleccionar el mismo archivo
        e.target.value = ""
    }

    // 2. Cancela la selección
    const cancelarArchivo = () => {
        if (archivoSel?.previewUrl) URL.revokeObjectURL(archivoSel.previewUrl)
        setArchivoSel(null)
        if (fileRef.current) fileRef.current.value = ""
    }

    // 3. Sube el archivo al servidor y notifica al padre
    const subirArchivo = async () => {
        if (!archivoSel || !amigoActivo) return false

        setSubiendo(true)
        const formData = new FormData()
        formData.append("archivo", archivoSel.file)
        formData.append("idEmisor", String(usuarioId))

        let url
        if (amigoActivo.esGrupo) {
            formData.append("idConversacion", String(amigoActivo.ID_Conversacion))
            url = `${API_URL}/mensajes/grupo/archivo`
        } else {
            formData.append("idReceptor", String(amigoActivo.ID_Us))
            url = `${API_URL}/mensajes/archivo`
        }

        try {
            const res = await fetch(url, { method: "POST", body: formData })
            const data = await res.json()
            console.log("Respuesta subida archivo:", data)

            if (res.ok) {
                // Notifica al padre con el archivo, el activo y la URL final (Cloudinary o Local)
                if (onArchivoEnviado) onArchivoEnviado(archivoSel.file, amigoActivo, data.archivo)
                cancelarArchivo()
                return true
            } else {
                toast.error(data.error || "Error al enviar el archivo")
                return false
            }
        } catch (err) {
            console.error("Error subiendo archivo:", err)
            toast.error("No se pudo conectar para enviar el archivo.")
            return false
        } finally {
            setSubiendo(false)
        }
    }

    // 4. Botón enviar: si hay archivo lo sube, si hay texto lo envía, puede ser ambos
    const handleEnviar = async () => {
        if (subiendo) return

        if (archivoSel) {
            await subirArchivo()
            // Si también hay texto escrito, enviarlo después del archivo
            if (mensaje.trim()) {
                enviarMensaje()
            }
        } else if (mensaje.trim()) {
            enviarMensaje()
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleEnviar()
        }
    }

    return (
        <div className="chat-input-wrapper">

            {/* ── Preview del archivo seleccionado ── */}
            {archivoSel && (
                <div className="archivo-preview">
                    {archivoSel.tipo === "imagen" ? (
                        <img
                            src={archivoSel.previewUrl}
                            alt="preview"
                            className="archivo-preview-img"
                        />
                    ) : (
                        <span className="archivo-preview-icon">📎</span>
                    )}
                    <span className="archivo-preview-nombre">{archivoSel.nombre}</span>
                    {subiendo ? (
                        <span className="archivo-subiendo">Enviando...</span>
                    ) : (
                        <button
                            className="archivo-cancelar"
                            onClick={cancelarArchivo}
                            title="Cancelar"
                        >✕</button>
                    )}
                </div>
            )}

            {/* ── Control de Encriptación Toggle ── */}
            <div className="encriptacion-toggle-container">
                <label className="encriptacion-switch">
                    <input 
                        type="checkbox" 
                        checked={encriptarMensajes} 
                        onChange={(e) => setEncriptarMensajes(e.target.checked)} 
                    />
                    <span className="encriptacion-slider"></span>
                </label>
                <span className={`encriptacion-label-text ${encriptarMensajes ? "activa" : ""}`}>
                    {encriptarMensajes ? "🔒 Cifrado AES Activado" : "🔓 Mensajes sin cifrar"}
                </span>
            </div>

            {/* ── Barra de input ── */}
            <div className="chat-input">
                {/* Input oculto de archivo */}
                <input
                    ref={fileRef}
                    type="file"
                    id="file-adjunto"
                    accept="image/jpeg,image/png,image/gif,image/webp,image/avif,application/pdf,text/plain"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />

                {/* Botón adjuntar */}
                <label
                    htmlFor="file-adjunto"
                    className="btn-adjuntar"
                    title="Adjuntar archivo"
                    style={{ opacity: subiendo ? 0.4 : 1, pointerEvents: subiendo ? "none" : "auto" }}
                >
                    <img src={MultimediaIcon} alt="Adjuntar" />
                </label>

                {/* Input de texto */}
                <input
                    className="chat-text-input"
                    placeholder={archivoSel ? "Añade un mensaje (opcional)..." : "Escribe algo..."}
                    value={mensaje}
                    disabled={subiendo}
                    onChange={(e) => setMensaje(e.target.value)}
                    onKeyPress={handleKeyPress}
                />

                {/* Botón enviar — aparece cuando hay texto o archivo */}
                {(mensaje.trim() || archivoSel) && (
                    <button
                        className="btn-enviar"
                        onClick={handleEnviar}
                        disabled={subiendo}
                        title="Enviar"
                    >
                        {subiendo ? "⏳" : "➤"}
                    </button>
                )}
            </div>
        </div>
    )
}

export default ChatInput