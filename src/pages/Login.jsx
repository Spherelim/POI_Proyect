import { useNavigate } from "react-router-dom"
import "./Login.css"

function Login(){
    const navigate = useNavigate();
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
                    <input type="text" placeholder="Nombre de Usuario" />
                    <input type="password" placeholder="Contraseña"/>
                    <a onClick={()=>navigate("/Singup")}>No tienes una cuenta? Registrate.</a>
                    <button onClick={()=>navigate("/Chat")}>Iniciar Sesión</button>
                </div>
            </div>
        </div>
    )
}

export default Login