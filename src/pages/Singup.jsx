import { useNavigate } from "react-router-dom"
import { useState } from "react"
import "./Singup.css"

function SingUp(){
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombreCompleto: "",
        nombreUsuario: "",
        fechaNac: "",
        correo: "",
        contrasena: ""
    });

    const registrar = async () => {

        if (!formData.nombreCompleto || !formData.nombreUsuario || !formData.fechaNac || !formData.correo || !formData.contrasena) {
            alert("Por favor, completa todos los campos.")
            return;
        }

        if (formData.contrasena.length < 8) {
            alert("La contraseña debe tener al menos 8 caracteres.")
            return;
        }

        if (!/\S+@\S+\.\S+/.test(formData.correo)) {
            alert("Por favor, ingresa un correo electrónico válido.")
            return;
        }

        await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombreCompleto: formData.nombreCompleto,
                nombreUsuario: formData.nombreUsuario,
                correo: formData.correo,
                contrasena: formData.contrasena,
                fechaNac: formData.fechaNac
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Respuesta del servidor:", data)
        })
        .catch(error => {
            console.error("Error al registrar usuario:", error)
            return;
        })

        console.log("Usuario registrado exitosamente")
        navigate("/Chat")
    }

    return(

        <div className="Image-Wrapper-Registro"> 

            <div className= "Imagen-Fondo-Registro"></div>

            <div className="Sing">
                <div className="Content">
                    
                    <button 
                        className="Btn-Cerrar" 
                        onClick={() => navigate("/")}
                        aria-label="Regresar a inicio">✕
                    </button>

                    <h1 className="Registrar">Registrar</h1>
                    <input 
                    type="text" 
                    placeholder="Nombre Completo" 
                    value={formData.nombreCompleto}
                    onChange={(e) => setFormData({...formData, nombreCompleto: e.target.value})}
                    />
                    <input 
                    type="text" 
                    placeholder="Nombre de Usuario" 
                    value={formData.nombreUsuario}
                    onChange={(e) => setFormData({...formData, nombreUsuario: e.target.value})}
                    />
                    <input 
                    type="email" 
                    placeholder="Correo Electronico" 
                    value={formData.correo}
                    onChange={(e) => setFormData({...formData, correo: e.target.value})}
                    />
                    <input 
                    type="password" 
                    placeholder="Contraseña" 
                    value={formData.contrasena}
                    onChange={(e) => setFormData({...formData, contrasena: e.target.value})}
                    />
                    <p>Fecha de Nacimiento</p>
                    <input 
                    type="date" 
                    placeholder="Fecha de Nacimiento" 
                    value={formData.fechaNac}
                    onChange={(e) => setFormData({...formData, fechaNac: e.target.value})}
                    />
                    <button className="Btn-Registrar" onClick={registrar}>Register</button>
                </div>
            </div>
        </div>
    )
}

export default SingUp