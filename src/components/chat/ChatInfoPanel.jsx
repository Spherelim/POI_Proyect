import "./ChatInfoPanel.css"

import SideInfo from "./SideInfo"
import UserPerfil from "./UserPerfil"
import Insignias from "./Insignias"

function ChatInfoPanel({cerrarInfo, amigo,usuarioActualId}){
    return(
        <div className="chat-info-panel">
            
            <div className="info-header">
                <SideInfo cerrarInfo={cerrarInfo}/>
            </div>

            <div>
                <UserPerfil amigo={amigo} usuarioActualId={usuarioActualId}/>
            </div>

            <div>
                <Insignias/>
            </div>

        </div>
    )
}

export default ChatInfoPanel