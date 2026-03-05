import { useNavigate } from "react-router-dom"
import "./StartButton.css"

function StartButton(){
    const navigate = useNavigate();
    return(
        <button className="start-btn" onClick={()=>navigate("/Chat")}>
            Chatear
        </button>
    )
}

export default StartButton