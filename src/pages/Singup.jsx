import { useNavigate } from "react-router-dom"
import "./Singup.css"

function SingUp(){
    const navigate = useNavigate();
    return(
        <div className="Sing">
            <div className="Content">
                <input type="text" placeholder="Nombre Completo" />
                <input type="text" placeholder="Nombre de Usuario" />
                <input type="email" placeholder="Correo Electronico" />
                <input type="password" placeholder="Contraseña" />
                <p>Fecha de Nacimiento</p>
                <input type="date" placeholder="Fecha de Nacimiento" />
                <button onClick={()=>navigate("/Chat")}>Register</button>
            </div>
        </div>
    )
}

export default SingUp