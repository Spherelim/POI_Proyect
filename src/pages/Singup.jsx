import { useNavigate } from "react-router-dom"
import "./Singup.css"

function SingUp(){
    const navigate = useNavigate();
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
                    <input type="text" placeholder="Nombre Completo" />
                    <input type="text" placeholder="Nombre de Usuario" />
                    <input type="email" placeholder="Correo Electronico" />
                    <input type="password" placeholder="Contraseña" />
                    <p>Fecha de Nacimiento</p>
                    <input type="date" placeholder="Fecha de Nacimiento" />
                    <button className="Btn-Registrar" onClick={()=>navigate("/Chat")}>Register</button>
                </div>
            </div>
        </div>
    )
}

export default SingUp