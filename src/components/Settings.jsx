import "./Settings.css"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Alert from "./Alert"
import {
    validarNombreUsuario,
    validarNombreCompleto,
    validarCorreo,
    validarFechaNacimiento
} from "../utils/validaciones"

import FotoDefault from "/src/assets/images/Conejito.jpg"
import BannerDefault from "/src/assets/images/Banner 3.png"
import { toast } from "react-toastify"

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
    const [errores, setErrores] = useState({})
    const [fotoPreview, setFotoPreview] = useState("")
    const [bannerPreview, setBannerPreview] = useState("")
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState({ text: "", type: "" })

    // Agregados - Referencias para inputs de archivos
    const [inventario, setInventario] = useState([]);
    const [cargandoInventario, setCargandoInventario] = useState(false);

    const fotoInputRef = useRef(null)
    const bannerInputRef = useRef(null)

    useEffect(() => {
        cargarDatosUsuario()
        cargarInventario() // Agregados
    }, [])

    const cargarDatosUsuario = async () => {
        try {
            const res = await fetch(`${API_URL}/usuarios/detalles/${usuarioActual.id}`)
            const data = await res.json()
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

    // Validar un campo individual en tiempo real
    const validarCampo = (campo, valor) => {
        let error = null
        if (campo === "nombreUsuario") error = validarNombreUsuario(valor)
        if (campo === "nombreCompleto") error = validarNombreCompleto(valor)
        if (campo === "correo") error = validarCorreo(valor)
        if (campo === "fechaNac") error = validarFechaNacimiento(valor)
        setErrores(prev => ({ ...prev, [campo]: error }))
    }

    const handleChange = (campo, valor) => {
        setUserData(prev => ({ ...prev, [campo]: valor }))
        validarCampo(campo, valor)
    }

    // Validar archivo de imagen — tipo y tamaño permitido
    const TIPOS_IMAGEN_PERMITIDOS = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/avif"
    ]
    const MAX_FILE_SIZE_MB = 5
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

    const validarArchivoImagen = (file) => {
        if (!file) return "No se seleccionó ningún archivo."
        if (!TIPOS_IMAGEN_PERMITIDOS.includes(file.type)) {
            return `Tipo de archivo no permitido (${file.type || "desconocido"}). Solo se aceptan: JPG, PNG, GIF, WEBP, AVIF.`
        }
        if (file.size > MAX_FILE_SIZE_BYTES) {
            const tamanioMB = (file.size / 1024 / 1024).toFixed(1)
            return `El archivo pesa ${tamanioMB} MB. El máximo permitido es ${MAX_FILE_SIZE_MB} MB.`
        }
        return null
    }

    // Comprimir imagen antes de subir
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
                    resolve(canvas.toDataURL('image/jpeg', calidad))
                }
                img.onerror = reject
            }
            reader.onerror = reject
        })
    }

    // Agregados 
    // Función para cargar inventario
    const cargarInventario = async () => {
        if (!usuarioActual?.id) return;
        setCargandoInventario(true);
        try {
            const res = await fetch(`${API_URL}/inventario/${usuarioActual.id}`);
            const data = await res.json();
            setInventario(data);
        } catch (error) {
            console.error("Error cargando inventario:", error);
            toast.error("No se pudo cargar tu inventario");
        } finally {
            setCargandoInventario(false);
        }
    };

    // Función para equipar un ítem
    const equiparItem = async (item) => {
        try {
            const res = await fetch(`${API_URL}/usuario/equipar`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idUsuario: usuarioActual.id, idItem: item.ID_Item })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(`¡${item.Nombre} equipado!`);
                // Recargar inventario para actualizar estados
                await cargarInventario();
            } else {
                toast.error(data.error || "Error al equipar");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error de conexión");
        }
    };

    // Función para desequipar (opcional)
    const desequiparItem = async (item) => {
        try {
            const res = await fetch(`${API_URL}/usuario/desequipar`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idUsuario: usuarioActual.id, idItem: item.ID_Item })
            });
            if (res.ok) {
                toast.success(`Ítem desequipado`);
                await cargarInventario();
            } else {
                toast.error("Error al desequipar");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error de conexión");
        }
    };

    // Agregados - Fin

    const handleFotoChange = async (e) => {
        const file = e.target.files[0]
        const errorArchivo = validarArchivoImagen(file)
        if (errorArchivo) {
            toast.error(errorArchivo)
            setMessage({ text: errorArchivo, type: "error" })
            e.target.value = "" // Limpiar el input
            return
        }
        try {
            const imagenComprimida = await comprimirImagen(file, 0.7, 500)
            setFotoPreview(imagenComprimida)
            setUserData(prev => ({ ...prev, foto: imagenComprimida }))
        } catch (error) {
            console.error("Error comprimiendo imagen:", error)
            toast.error("Error al procesar la imagen de perfil.")
            setMessage({ text: "Error al procesar la imagen.", type: "error" })
        }
    }

    const handleBannerChange = async (e) => {
        const file = e.target.files[0]
        const errorArchivo = validarArchivoImagen(file)
        if (errorArchivo) {
            toast.error(errorArchivo)
            setMessage({ text: errorArchivo, type: "error" })
            e.target.value = "" // Limpiar el input
            return
        }
        try {
            const imagenComprimida = await comprimirImagen(file, 0.7, 1200)
            setBannerPreview(imagenComprimida)
            setUserData(prev => ({ ...prev, banner: imagenComprimida }))
        } catch (error) {
            console.error("Error comprimiendo imagen:", error)
            toast.error("Error al procesar la imagen de banner.")
            setMessage({ text: "Error al procesar la imagen.", type: "error" })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage({ text: "", type: "" })

        // Validar todos los campos antes de enviar
        const err = {
            nombreUsuario: validarNombreUsuario(userData.nombreUsuario),
            nombreCompleto: validarNombreCompleto(userData.nombreCompleto),
            correo: validarCorreo(userData.correo),
            fechaNac: validarFechaNacimiento(userData.fechaNac)
        }
        setErrores(err)

        const primerError = Object.values(err).find(e => e !== null)
        if (primerError) {
            setMessage({ text: primerError, type: "error" })
            toast.error(primerError)
            return
        }

        setSaving(true)
        try {
            if (fotoInputRef.current?.files[0]) {
                const formData = new FormData()
                formData.append('foto', fotoInputRef.current.files[0])
                await fetch(`${API_URL}/upload/foto/${usuarioActual.id}`, { method: 'POST', body: formData })
            }
            if (bannerInputRef.current?.files[0]) {
                const formData = new FormData()
                formData.append('banner', bannerInputRef.current.files[0])
                await fetch(`${API_URL}/upload/banner/${usuarioActual.id}`, { method: 'POST', body: formData })
            }

            const res = await fetch(`${API_URL}/usuarios/actualizar/${usuarioActual.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombreUsuario: userData.nombreUsuario.trim(),
                    nombreCompleto: userData.nombreCompleto.trim(),
                    correo: userData.correo.trim(),
                    fechaNac: userData.fechaNac,
                    descripcion: userData.descripcion
                })
            })

            const data = await res.json()
            if (res.ok) {
                setMessage({ text: "¡Datos actualizados correctamente!", type: "success" })
                toast.success("¡Datos actualizados correctamente!")
                const usuarioActualizado = {
                    ...usuarioActual,
                    nombreUsuario: userData.nombreUsuario.trim(),
                    nombreCompleto: userData.nombreCompleto.trim()
                }
                localStorage.setItem("usuario", JSON.stringify(usuarioActualizado))
                setTimeout(() => setMessage({ text: "", type: "" }), 3000)
            } else {
                setMessage({ text: data.error || "Error al actualizar", type: "error" })
                toast.error(data.error || "Error al actualizar")
            }
        } catch (error) {
            console.error("Error:", error)
            setMessage({ text: "Error de conexión", type: "error" })
            toast.error("Error de conexión al actualizar los datos.")
        } finally {
            setSaving(false)
        }
    }

    const handleConfirmLogout = () => {
        localStorage.removeItem("usuario")
        navigate("/Login")
    }

    //Agregados - Personalización en ChatHeader
    const getMosaicoUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `/${path}`;
    };

    if (loading) {
        return <div className="SettingsContainer"><p style={{ color: "white", textAlign: "center", paddingTop: 40 }}>Cargando...</p></div>
    }

    return (
        <div className="SettingsContainer">
            <form onSubmit={handleSubmit}>

                {/* ── Foto y Banner ─────────────────────────── */}
                <div className="SettingsCard">
                    <div className="SettingsTitle">Foto y Banner</div>
                    <div className="PhotoSection">
                        <div className="PhotoCard">
                            <p className="photo-label">Foto de Perfil</p>
                            <img
                                src={fotoPreview || FotoDefault}
                                alt="Preview"
                                className="AvatarPreview"
                                onError={(e) => e.target.src = FotoDefault}
                            />
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/avif"
                                onChange={handleFotoChange}
                                style={{ display: "none" }}
                                ref={fotoInputRef}
                            />
                            <button type="button" className="FileInputLabel" onClick={() => fotoInputRef.current.click()}>
                                Cambiar Foto
                            </button>
                        </div>

                        <div className="PhotoCard">
                            <p className="photo-label">Banner</p>
                            <img
                                src={bannerPreview || BannerDefault}
                                alt="Banner Preview"
                                className="BannerPreview"
                                onError={(e) => e.target.src = BannerDefault}
                            />
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/avif"
                                onChange={handleBannerChange}
                                style={{ display: "none" }}
                                ref={bannerInputRef}
                            />
                            <button type="button" className="FileInputLabel" onClick={() => bannerInputRef.current.click()}>
                                Cambiar Banner
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Personalización (Inventario) ───────────────── */}
                <div className="SettingsCard">
                    <div className="SettingsTitle">Personalización</div>
                    {cargandoInventario ? (
                        <p style={{ color: "#94a3b8", textAlign: "center" }}>Cargando tus objetos...</p>
                    ) : inventario.length === 0 ? (
                        <p style={{ color: "#cbd5e1", textAlign: "center" }}>Aún no has comprado nada. Visita la tienda para obtener objetos exclusivos.</p>
                    ) : (
                        <div className="inventario-grid">
                            {inventario.map(item => {
                                const isEquipped = item.Equipado === 1;
                                // Previsualización según tipo (similar a la tienda)
                                let preview = null;
                                if (item.Tipo === 'color') {
                                    preview = <div className="preview-color-mini" style={{ background: `linear-gradient(135deg, ${item.Color_1 || '#ccc'}, ${item.Color_2 || '#888'})` }} />;
                                } else if (item.Tipo === 'marco') {
                                    preview = <div className="preview-marco-mini" style={{ border: `3px solid transparent`, background: `linear-gradient(white, white) padding-box, linear-gradient(135deg, ${item.Color_1 || '#FFD700'}, ${item.Color_2 || '#FFA500'}) border-box` }} />;
                                } else if (item.Tipo === 'mosaico') {
                                    preview = <div className="preview-mosaico-mini" style={{ backgroundImage: `url(${getMosaicoUrl(item.Mosaico)})`, backgroundSize: 'cover' }} />;
                                }
                                return (
                                    <div key={item.ID_Item} className="inventario-item">
                                        <div className="inventario-preview">{preview || <span className="item-emoji-mini">🎁</span>}</div>
                                        <div className="inventario-info">
                                            <strong>{item.Nombre}</strong>
                                            <span className="item-tipo-mini">{item.Tipo}</span>
                                        </div>
                                        {isEquipped ? (
                                            <button className="btn-equipado" onClick={() => desequiparItem(item)}>Equipado ✓</button>
                                        ) : (
                                            <button className="btn-equipar" onClick={() => equiparItem(item)}>Equipar</button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ── Información Personal ──────────────────── */}
                <div className="SettingsCard">
                    <div className="SettingsTitle">Información Personal</div>

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
                                onChange={(e) => handleChange("nombreUsuario", e.target.value)}
                                placeholder="ej: juan_perez123"
                                maxLength={30}
                                className={errores.nombreUsuario ? "input-error" : ""}
                                required
                            />
                            {errores.nombreUsuario && <span className="field-error">{errores.nombreUsuario}</span>}
                            <span className="field-hint">Solo letras (a-z), números, puntos y guiones bajos.</span>
                        </div>

                        <div className="FormGroup">
                            <label>Nombre Completo</label>
                            <input
                                type="text"
                                value={userData.nombreCompleto}
                                onChange={(e) => handleChange("nombreCompleto", e.target.value)}
                                placeholder="ej: Juan Pérez"
                                maxLength={60}
                                className={errores.nombreCompleto ? "input-error" : ""}
                            />
                            {errores.nombreCompleto && <span className="field-error">{errores.nombreCompleto}</span>}
                        </div>
                    </div>

                    <div className="DoubleColumn">
                        <div className="FormGroup">
                            <label>Correo Electrónico *</label>
                            <input
                                type="email"
                                value={userData.correo}
                                onChange={(e) => handleChange("correo", e.target.value)}
                                placeholder="ej: correo@dominio.com"
                                maxLength={100}
                                className={errores.correo ? "input-error" : ""}
                                required
                            />
                            {errores.correo && <span className="field-error">{errores.correo}</span>}
                        </div>

                        <div className="FormGroup">
                            <label>Fecha de Nacimiento</label>
                            <input
                                type="date"
                                value={userData.fechaNac}
                                onChange={(e) => handleChange("fechaNac", e.target.value)}
                                max={new Date().toISOString().split('T')[0]}
                                className={errores.fechaNac ? "input-error" : ""}
                            />
                            {errores.fechaNac && <span className="field-error">{errores.fechaNac}</span>}
                        </div>
                    </div>

                    <div className="FormGroup">
                        <label>Descripción / Estado</label>
                        <textarea
                            rows="3"
                            value={userData.descripcion}
                            onChange={(e) => setUserData(prev => ({ ...prev, descripcion: e.target.value }))}
                            placeholder="Escribe algo sobre ti..."
                            maxLength={160}
                        />
                        <span className="field-hint">{userData.descripcion.length}/160 caracteres</span>
                    </div>
                </div>

                {/* ── Sesión ───────────────────────────────── */}
                <div className="SettingsCard SettingsCard--danger">
                    <div className="SettingsTitle">Sesión de Usuario</div>
                    <p className="danger-hint">
                        Al cerrar sesión, tus credenciales guardadas localmente serán eliminadas y serás redirigido al inicio de sesión.
                    </p>
                    <button type="button" className="LogoutButton" onClick={() => setMostrarAlert(true)}>
                        Cerrar Sesión
                    </button>
                </div>

                {/* ── Botones de acción ─────────────────────── */}
                <div className="ButtonGroup">
                    <button type="button" className="CancelButton" onClick={cargarDatosUsuario}>
                        Cancelar
                    </button>
                    <button type="submit" className="SaveButton" disabled={saving}>
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