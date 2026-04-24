import { useNavigate } from "react-router-dom"
import { useState } from "react"
import "./Login.css"

function Login(){
    const navigate = useNavigate();

    const [nombre, setNombre] = useState("");
    const [contrasena, setContrasena] = useState("");

    const Loguearse = async () => {
        
        if (!nombre || !contrasena) {
            alert("Por favor, completa todos los campos.")
            return;
        }

        try{
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre,
                    contrasena
                })
            })
            
            const data = await response.json()

            if (!response.ok) {
                alert(data.error || "Error al iniciar sesión.")
                return;
            }

            console.log("Usuario logueado exitosamente:", data)
            
            localStorage.setItem("usuario",JSON.stringify(data.user))

            navigate("/Chat")

        }catch(error){
            console.error("Error al iniciar sesión:", error)
            return;
        }

    }

    return(
        <div className="Image-Wrapper-Login"> 

            <div className= "Imagen-Fondo-Login"></div>
            
            <div className="Log">
                <div className="Content">

                    <button 
                        className="Btn-Cerrar" 
                        onClick={() => navigate("/")}
                        aria-label="Regresar a inicio">✕
                    </button>

                    <h2>Login</h2>
                    <input 
                        type="text" 
                        placeholder="Nombre de Usuario" 
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                    <input 
                        type="password" 
                        placeholder="Contraseña" 
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                    />
                    <a onClick={()=>navigate("/Singup")}>No tienes una cuenta? Registrate.</a>
                    <button onClick={Loguearse}>Iniciar Sesión</button>
                </div>
            </div>
        </div>
    )
}

export default Login