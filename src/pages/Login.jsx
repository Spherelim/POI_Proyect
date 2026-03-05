import { useNavigate } from "react-router-dom"
import "./Login.css"

function Login(){
    const navigate = useNavigate();
    return(
        <div className="Log">
            <h1>Nombre Usuario</h1>
            <h1>Contraseña</h1>
            <a onClick={()=>navigate("/Singup")}>No tienes una cuenta? Registrate.</a>
            <button>Log</button>
        </div>
    )
}

export default Login