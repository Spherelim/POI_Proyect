import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { toast } from "react-toastify"
import "./Singup.css"
import {
    validarNombreUsuario,
    validarNombreCompleto,
    validarCorreo,
    validarFechaNacimiento,
    validarContrasena
} from "../utils/validaciones"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

function SingUp(){
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        nombreCompleto: "",
        nombreUsuario: "",
        fechaNac: "",
        correo: "",
        contrasena: ""
    })
    const [errores, setErrores] = useState({})

    // Fecha máxima = hoy, fecha mínima = 110 años atrás
    const hoy = new Date().toISOString().split('T')[0]
    const minFecha = new Date(new Date().setFullYear(new Date().getFullYear() - 110)).toISOString().split('T')[0]

    const validarCampo = (campo, valor) => {
        let error = null
        if (campo === "nombreCompleto") error = validarNombreCompleto(valor) 
            ?? (valor.trim().length === 0 ? "El nombre completo es obligatorio." : null)
        if (campo === "nombreUsuario") error = validarNombreUsuario(valor)
        if (campo === "correo") error = validarCorreo(valor)
        if (campo === "fechaNac") error = validarFechaNacimiento(valor)
            ?? (valor === "" ? "La fecha de nacimiento es obligatoria." : null)
        if (campo === "contrasena") error = validarContrasena(valor)
        setErrores(prev => ({ ...prev, [campo]: error }))
    }

    const handleChange = (campo, valor) => {
        setFormData(prev => ({ ...prev, [campo]: valor }))
        validarCampo(campo, valor)
    }

    const registrar = async () => {
        // Validar todos los campos
        const validaciones = {
            nombreCompleto: validarNombreCompleto(formData.nombreCompleto) 
                || (formData.nombreCompleto.trim() === "" ? "El nombre completo es obligatorio." : null),
            nombreUsuario: validarNombreUsuario(formData.nombreUsuario),
            correo: validarCorreo(formData.correo),
            fechaNac: validarFechaNacimiento(formData.fechaNac)
                || (formData.fechaNac === "" ? "La fecha de nacimiento es obligatoria." : null),
            contrasena: validarContrasena(formData.contrasena)
        }
        setErrores(validaciones)

        const primerError = Object.values(validaciones).find(e => e !== null)
        if (primerError) {
            toast.warning(primerError)
            return
        }

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombreCompleto: formData.nombreCompleto.trim(),
                    nombreUsuario: formData.nombreUsuario.trim(),
                    correo: formData.correo.trim().toLowerCase(),
                    contrasena: formData.contrasena,
                    fechaNac: formData.fechaNac
                })
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error(data.error || "Error al registrar usuario.")
                return
            }

            toast.success("¡Registro completado! Ahora inicia sesión.")
            navigate("/Login")
        } catch (error) {
            console.error("Error:", error)
            toast.error("No se pudo conectar al servidor.")
        }
    }

    return(
        <div className="Image-Wrapper-Registro">
            <div className="Imagen-Fondo-Registro"></div>

            <div className="Sing">
                <div className="Content">

                    <button
                        className="Btn-Cerrar"
                        onClick={() => navigate("/")}
                        aria-label="Regresar a inicio">✕
                    </button>

                    <h1 className="Registrar">Crear Cuenta</h1>

                    {/* Nombre completo */}
                    <div className="input-wrapper">
                        <input
                            type="text"
                            placeholder="Nombre Completo"
                            value={formData.nombreCompleto}
                            onChange={(e) => handleChange("nombreCompleto", e.target.value)}
                            maxLength={60}
                            className={errores.nombreCompleto ? "input-error-reg" : ""}
                        />
                        {errores.nombreCompleto && <span className="error-hint">{errores.nombreCompleto}</span>}
                    </div>

                    {/* Nombre de usuario */}
                    <div className="input-wrapper">
                        <input
                            type="text"
                            placeholder="Nombre de Usuario"
                            value={formData.nombreUsuario}
                            onChange={(e) => handleChange("nombreUsuario", e.target.value)}
                            maxLength={30}
                            className={errores.nombreUsuario ? "input-error-reg" : ""}
                        />
                        {errores.nombreUsuario && <span className="error-hint">{errores.nombreUsuario}</span>}
                        <span className="reg-hint">Solo letras (a-z), números, puntos y guiones bajos. Sin espacios.</span>
                    </div>

                    {/* Correo */}
                    <div className="input-wrapper">
                        <input
                            type="email"
                            placeholder="Correo Electrónico"
                            value={formData.correo}
                            onChange={(e) => handleChange("correo", e.target.value)}
                            maxLength={100}
                            className={errores.correo ? "input-error-reg" : ""}
                        />
                        {errores.correo && <span className="error-hint">{errores.correo}</span>}
                    </div>

                    {/* Contraseña */}
                    <div className="input-wrapper">
                        <input
                            type="password"
                            placeholder="Contraseña (mín. 8 caracteres)"
                            value={formData.contrasena}
                            onChange={(e) => handleChange("contrasena", e.target.value)}
                            maxLength={128}
                            className={errores.contrasena ? "input-error-reg" : ""}
                        />
                        {errores.contrasena && <span className="error-hint">{errores.contrasena}</span>}
                    </div>

                    {/* Fecha de nacimiento */}
                    <div className="input-wrapper">
                        <label className="date-label">Fecha de Nacimiento</label>
                        <input
                            type="date"
                            value={formData.fechaNac}
                            onChange={(e) => handleChange("fechaNac", e.target.value)}
                            max={hoy}
                            min={minFecha}
                            className={errores.fechaNac ? "input-error-reg" : ""}
                        />
                        {errores.fechaNac && <span className="error-hint">{errores.fechaNac}</span>}
                        <span className="reg-hint">Debes tener al menos 8 años para registrarte.</span>
                    </div>

                    <button className="Btn-Registrar" onClick={registrar}>Registrarse</button>

                    <p className="login-link">
                        ¿Ya tienes cuenta? <span onClick={() => navigate("/Login")}>Inicia sesión</span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SingUp
