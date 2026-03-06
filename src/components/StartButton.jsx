import { useNavigate } from "react-router-dom"

function StartButton(){
    const navigate = useNavigate();
    return(
        <button className="start-btn" onClick={()=>navigate("/Chat")}>
            Chatear
        </button>
    )
}

export default StartButton