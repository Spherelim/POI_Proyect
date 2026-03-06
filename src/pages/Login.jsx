import { useNavigate } from "react-router-dom"
import "./Login.css"

function Login(){
    const navigate = useNavigate();
    return(
        <div className="Log">
            <div className="Content">
                <input type="text" placeholder="Nombre de Usuario" />
                <input type="password" placeholder="Contraseña"/>
                <a onClick={()=>navigate("/Singup")}>No tienes una cuenta? Registrate.</a>
                <button onClick={()=>navigate("/Chat")}>Log</button>
            </div>
        </div>
    )
}

export default Login