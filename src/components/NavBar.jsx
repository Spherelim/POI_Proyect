import "./NavBar.css"
import { useNavigate } from "react-router-dom";

function NavBar(){

    const navigate = useNavigate()

    return(
        <div className="navbar">
            <h1>MundiChat</h1>
            
            <button className="log-in" onClick={()=>navigate("/Login")}>
                Iniciar sesión
            </button>
        </div>
    );
}

export default NavBar