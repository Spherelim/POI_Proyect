import "./NavBar.css"
import { useNavigate } from "react-router-dom";

function NavBar(){

    const navigate = useNavigate()

    return(
        <div className="navbar">
            <h2>MundiChat</h2>
            
            <button className="log-in" onClick={()=>navigate("/Login")}>
                Iniciar sesión
            </button>
        </div>
    );
}

export default NavBar