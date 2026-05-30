import "./Settings.css"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Alert from "./Alert"

import FotoDefault from "/src/assets/images/Conejito.jpg"
import BannerDefault from "/src/assets/images/Banner 3.png"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

function Settings() {
    const navigate = useNavigate()
    const usuarioActual = JSON.parse(localStorage.getItem("usuario"))
    const [mostrarAlert, setMostrarAlert] = useState(false)
    const [userData, setUserData] = useState({
        nombreUsuario: "",
        nombreCompleto: "",
        correo: "",
        fechaNac: "",
        foto: "",
        banner: "",
        descripcion: ""
    })
    const [fotoPreview, setFotoPreview] = useState("")
    const [bannerPreview, setBannerPreview] = useState("")
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState({ text: "", type: "" })
    
    const fotoInputRef = useRef(null)
    const bannerInputRef = useRef(null)

    useEffect(() => {
        cargarDatosUsuario()
    }, [])

    const cargarDatosUsuario = async () => {
        try {
            const res = await fetch(`${API_URL}/usuarios/detalles/${usuarioActual.id}`)
            const data = await res.json()
            
            console.log("Datos cargados:", data)
            
            setUserData({
                nombreUsuario: data.NombreUsuario || "",
                nombreCompleto: data.NombreCompleto || "",
                correo: data.Correo || "",
                fechaNac: data.FechaNac ? data.FechaNac.split('T')[0] : "",
                foto: data.Foto || "",
                banner: data.Banner || "",
                descripcion: data.Descripcion || ""
            })
            
            setFotoPreview(data.Foto ? `${API_URL}${data.Foto}` : FotoDefault)
            setBannerPreview(data.Banner ? `${API_URL}${data.Banner}` : BannerDefault)
            setLoading(false)
        } catch (error) {
            console.error("Error cargando datos:", error)
            setMessage({ text: "Error al cargar datos", type: "error" })
            setLoading(false)
        }
    }

    // Función para comprimir imagen
    const comprimirImagen = (file, calidad = 0.7, maxWidth = 800) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = (event) => {
                const img = new Image()
                img.src = event.target.result
                img.onload = () => {
                    const canvas = document.createElement('canvas')
                    let width = img.width
                    let height = img.height
                    
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width
                        width = maxWidth
                    }
                    
                    canvas.width = width
                    canvas.height = height
                    const ctx = canvas.getContext('2d')
                    ctx.drawImage(img, 0, 0, width, height)
                    
                    const dataUrl = canvas.toDataURL('image/jpeg', calidad)
                    resolve(dataUrl)
                }
                img.onerror = reject
            }
            reader.onerror = reject
        })
    }

    // Actualiza handleFotoChange
    const handleFotoChange = async (e) => {
        const file = e.target.files[0]
        if (file && file.type.startsWith('image/')) {
            try {
                const imagenComprimida = await comprimirImagen(file, 0.7, 500)
                setFotoPreview(imagenComprimida)
                setUserData({ ...userData, foto: imagenComprimida })
            } catch (error) {
                console.error("Error comprimiendo imagen:", error)
            }
        }
    }

    // Actualiza handleBannerChange
    const handleBannerChange = async (e) => {
        const file = e.target.files[0]
        if (file && file.type.startsWith('image/')) {
            try {
                const imagenComprimida = await comprimirImagen(file, 0.7, 1200)
                setBannerPreview(imagenComprimida)
                setUserData({ ...userData, banner: imagenComprimida })
            } catch (error) {
                console.error("Error comprimiendo imagen:", error)
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setMessage({ text: "", type: "" })

        try {
            // Primero subir foto si cambió
            if (fotoInputRef.current?.files[0]) {
                const formData = new FormData()
                formData.append('foto', fotoInputRef.current.files[0])
                await fetch(`${API_URL}/upload/foto/${usuarioActual.id}`, {
                    method: 'POST',
                    body: formData
                })
            }

            // Subir banner si cambió
            if (bannerInputRef.current?.files[0]) {
                const formData = new FormData()
                formData.append('banner', bannerInputRef.current.files[0])
                await fetch(`${API_URL}/upload/banner/${usuarioActual.id}`, {
                    method: 'POST',
                    body: formData
                })
            }

            // Actualizar datos de texto
            const res = await fetch(`${API_URL}/usuarios/actualizar/${usuarioActual.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombreUsuario: userData.nombreUsuario,
                    nombreCompleto: userData.nombreCompleto,
                    correo: userData.correo,
                    fechaNac: userData.fechaNac,
                    descripcion: userData.descripcion
                })
            })

            const data = await res.json()
            
            if (res.ok) {
                setMessage({ text: "¡Datos actualizados correctamente!", type: "success" })
                
                const usuarioActualizado = { 
                    ...usuarioActual, 
                    nombreUsuario: userData.nombreUsuario,
                    nombreCompleto: userData.nombreCompleto
                }
                localStorage.setItem("usuario", JSON.stringify(usuarioActualizado))
                
                setTimeout(() => setMessage({ text: "", type: "" }), 3000)
            } else {
                setMessage({ text: data.error || "Error al actualizar", type: "error" })
            }
        } catch (error) {
            console.error("Error:", error)
            setMessage({ text: "Error de conexión", type: "error" })
        } finally {
            setSaving(false)
        }
    }

    const handleConfirmLogout = () => {
        localStorage.removeItem("usuario")
        navigate("/Login")
    }

    if (loading) {
        return <div className="SettingsContainer">Cargando...</div>
    }

    return (
        <div className="SettingsContainer">
            <form onSubmit={handleSubmit}>
                {/* Foto y Banner */}
                <div className="SettingsCard">
                    <div className="SettingsTitle">
                        <span>📸</span>
                        <span>Foto y Banner</span>
                    </div>
                    
                    <div className="PhotoSection">
                        <div className="PhotoCard">
                            <h4>Foto de Perfil</h4>
                            <img 
                                src={fotoPreview || "/src/assets/images/conejito.jpg"} 
                                alt="Preview" 
                                className="AvatarPreview"
                                onError={(e) => e.target.src = "/src/assets/images/conejito.jpg"}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFotoChange}
                                style={{ display: "none" }}
                                ref={fotoInputRef}
                            />
                            <button 
                                type="button" 
                                className="FileInputLabel"
                                onClick={() => fotoInputRef.current.click()}
                            >
                                Cambiar Foto
                            </button>
                        </div>
                        
                        <div className="PhotoCard">
                            <h4>Banner</h4>
                            <img 
                                src={bannerPreview || "/src/assets/images/Banner 1.jpg"} 
                                alt="Banner Preview" 
                                className="BannerPreview"
                                onError={(e) => e.target.src = "/src/assets/images/Banner 3.png"}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleBannerChange}
                                style={{ display: "none" }}
                                ref={bannerInputRef}
                            />
                            <button 
                                type="button" 
                                className="FileInputLabel"
                                onClick={() => bannerInputRef.current.click()}
                            >
                                Cambiar Banner
                            </button>
                        </div>
                    </div>
                </div>

                {/* Información Personal */}
                <div className="SettingsCard">
                    <div className="SettingsTitle">
                        <span>👤</span>
                        <span>Información Personal</span>
                    </div>

                    {message.text && (
                        <div className={message.type === "success" ? "SuccessMessage" : "ErrorMessage"}>
                            {message.text}
                        </div>
                    )}

                    <div className="DoubleColumn">
                        <div className="FormGroup">
                            <label>Nombre de Usuario *</label>
                            <input
                                type="text"
                                value={userData.nombreUsuario}
                                onChange={(e) => setUserData({ ...userData, nombreUsuario: e.target.value })}
                                required
                            />
                        </div>

                        <div className="FormGroup">
                            <label>Nombre Completo</label>
                            <input
                                type="text"
                                value={userData.nombreCompleto}
                                onChange={(e) => setUserData({ ...userData, nombreCompleto: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="DoubleColumn">
                        <div className="FormGroup">
                            <label>Correo Electrónico *</label>
                            <input
                                type="email"
                                value={userData.correo}
                                onChange={(e) => setUserData({ ...userData, correo: e.target.value })}
                                required
                            />
                        </div>

                        <div className="FormGroup">
                            <label>Fecha de Nacimiento</label>
                            <input
                                type="date"
                                value={userData.fechaNac}
                                onChange={(e) => setUserData({ ...userData, fechaNac: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="FormGroup">
                        <label>Descripción / Estado</label>
                        <textarea
                            rows="3"
                            value={userData.descripcion}
                            onChange={(e) => setUserData({ ...userData, descripcion: e.target.value })}
                            placeholder="Escribe algo sobre ti..."
                        />
                    </div>
                </div>

                {/* Gestión de Cuenta */}
                <div className="SettingsCard">
                    <div className="SettingsTitle" style={{ color: "#e74c3c" }}>
                        <span>🔒</span>
                        <span>Sesión de Usuario</span>
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", margin: "0 0 15px 0" }}>
                        Al cerrar sesión se eliminarán tus credenciales guardadas localmente y serás redirigido a la pantalla de inicio de sesión.
                    </p>
                    <button 
                        type="button" 
                        className="LogoutButton"
                        onClick={() => setMostrarAlert(true)}
                    >
                        Cerrar Sesión
                    </button>
                </div>

                {/* Botones */}
                <div className="ButtonGroup">
                    <button 
                        type="button" 
                        className="CancelButton"
                        onClick={() => cargarDatosUsuario()}
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        className="SaveButton"
                        disabled={saving}
                    >
                        {saving ? "Guardando..." : "Guardar Cambios"}
                    </button>
                </div>
            </form>

            {mostrarAlert && (
                <Alert
                    Titulo="¿Cerrar Sesión?"
                    mensaje="¿Estás seguro de que deseas cerrar tu sesión? Tendrás que volver a ingresar tus credenciales."
                    cerrar={() => setMostrarAlert(false)}
                    onConfirm={handleConfirmLogout}
                />
            )}
        </div>
    )
}

export default Settings