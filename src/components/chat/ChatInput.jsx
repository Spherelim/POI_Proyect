import "./ChatInput.css"
import { useState, useRef, useEffect } from "react"
import { toast } from "react-toastify"

import MultimediaIcon from "/src/assets/icons/chat/agregar (w).png"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

function ChatInput({ mensaje, setMensaje, enviarMensaje, onArchivoEnviado, onUbicacionEnviada, amigoActivo, usuarioId, encriptarMensajes, setEncriptarMensajes }) {

    // Archivo seleccionado pero aún NO enviado
    const [archivoSel, setArchivoSel] = useState(null) // { file, previewUrl, tipo, nombre }
    const [subiendo, setSubiendo] = useState(false)
    const [obteniendoUbicacion, setObteniendoUbicacion] = useState(false)
    const [mostrarMenuAdjuntos, setMostrarMenuAdjuntos] = useState(false)
    const fileRef = useRef(null)

    // Ocultar menú si cambiamos de chat
    useEffect(() => {
        setMostrarMenuAdjuntos(false)
    }, [amigoActivo])

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
        setMostrarMenuAdjuntos(false) // Ocultar menú tras seleccionar
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

    const handlePaste = (e) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
                e.preventDefault();
                const file = items[i].getAsFile();
                if (file) {
                    setArchivoSel({
                        file,
                        previewUrl: URL.createObjectURL(file),
                        tipo: "imagen",
                        nombre: file.name || "imagen_pegada.png"
                    });
                }
                break; // Solo procesar la primera imagen si hay varias
            }
        }
    }

    const handleSendLocation = () => {
        setMostrarMenuAdjuntos(false) // Ocultar el menú inmediatamente
        
        if (!navigator.geolocation) {
            toast.error("La geolocalización no está soportada por tu navegador.")
            return
        }

        setObteniendoUbicacion(true)
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords
                const coordsStr = `${latitude},${longitude}`

                // Enviar la ubicación al chat
                if (onUbicacionEnviada) {
                    await onUbicacionEnviada(coordsStr)
                }
                setObteniendoUbicacion(false)
            },
            (error) => {
                console.error("Error al obtener ubicación:", error)
                setObteniendoUbicacion(false)
                let errorMsg = "Error al obtener la ubicación."
                if (error.code === error.PERMISSION_DENIED) {
                    errorMsg = "Permiso denegado para acceder a la ubicación."
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    errorMsg = "La información de ubicación no está disponible."
                } else if (error.code === error.TIMEOUT) {
                    errorMsg = "Se agotó el tiempo de espera para obtener la ubicación."
                }
                toast.error(errorMsg)
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        )
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

                {/* Menú de adjuntos interactivo estilo WhatsApp */}
                <div style={{ position: "relative" }}>
                    <button
                        type="button"
                        className="btn-adjuntar"
                        onClick={() => setMostrarMenuAdjuntos(!mostrarMenuAdjuntos)}
                        disabled={subiendo || obteniendoUbicacion}
                        style={{
                            opacity: (subiendo || obteniendoUbicacion) ? 0.4 : 1,
                            pointerEvents: (subiendo || obteniendoUbicacion) ? "none" : "auto",
                            background: "transparent",
                            border: "none",
                            fontSize: "28px",
                            color: "white",
                            cursor: "pointer",
                            width: "35px",
                            height: "35px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            transition: "transform 0.2s, background 0.2s",
                            borderRadius: "50%"
                        }}
                        onMouseEnter={(e) => { 
                            if(!subiendo && !obteniendoUbicacion) {
                                e.currentTarget.style.transform = "scale(1.1)";
                                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.backgroundColor = "transparent";
                        }}
                        title="Adjuntar"
                    >
                        +
                    </button>

                    {/* Capa invisible para cerrar el menú al hacer clic fuera */}
                    {mostrarMenuAdjuntos && (
                        <div 
                            style={{ position: "fixed", inset: 0, zIndex: 99 }} 
                            onClick={() => setMostrarMenuAdjuntos(false)}
                        />
                    )}

                    {mostrarMenuAdjuntos && (
                        <div style={{
                            position: "absolute",
                            bottom: "100%",
                            left: "0",
                            marginBottom: "15px",
                            backgroundColor: "rgba(30, 30, 40, 0.95)",
                            borderRadius: "16px",
                            padding: "20px 15px",
                            display: "flex",
                            gap: "20px",
                            boxShadow: "0px -4px 15px rgba(0, 0, 0, 0.4)",
                            backdropFilter: "blur(10px)",
                            zIndex: 100
                        }}>
                            {/* Opcion Documento/Foto */}
                            <label
                                htmlFor="file-adjunto"
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: "8px",
                                    cursor: "pointer",
                                    transition: "transform 0.2s"
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                            >
                                <div style={{
                                    width: "65px",
                                    height: "45px",
                                    borderRadius: "25px",
                                    backgroundColor: "transparent",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
                                }}>
                                    <img src={MultimediaIcon} alt="Multimedia" style={{ width: "24px", height: "24px", filter: "invert(0.5) sepia(1) saturate(5) hue-rotate(220deg)" }} />
                                </div>
                                <span style={{ fontSize: "13px", color: "#ddd", fontWeight: "500" }}>Galería</span>
                            </label>

                            {/* Opcion Ubicación */}
                            <button
                                type="button"
                                onClick={handleSendLocation}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: "8px",
                                    cursor: "pointer",
                                    background: "none",
                                    border: "none",
                                    padding: 0,
                                    transition: "transform 0.2s"
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                            >
                                <div style={{
                                    width: "65px",
                                    height: "45px",
                                    borderRadius: "25px",
                                    backgroundColor: "transparent",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
                                }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C8.134 2 5 5.134 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.134 15.866 2 12 2ZM12 11.5C10.619 11.5 9.5 10.381 9.5 9C9.5 7.619 10.619 6.5 12 6.5C13.381 6.5 14.5 7.619 14.5 9C14.5 10.381 13.381 11.5 12 11.5Z" fill="#00D28E"/>
                                    </svg>
                                </div>
                                <span style={{ fontSize: "13px", color: "#ddd", fontWeight: "500" }}>Ubicación</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Input de texto */}
                <input
                    className="chat-text-input"
                    placeholder={archivoSel ? "Añade un mensaje (opcional)..." : "Escribe algo..."}
                    value={mensaje}
                    disabled={subiendo}
                    onChange={(e) => setMensaje(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onPaste={handlePaste}
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