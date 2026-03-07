import "./ChatInfoPanel.css"

import SideInfo from "./SideInfo"
import UserPerfil from "./UserPerfil"
import Insignias from "./Insignias"

function ChatInfoPanel({cerrarInfo}){
    return(
        <div className="chat-info-panel">
            
            <div className="info-header">
                <SideInfo cerrarInfo={cerrarInfo}/>
            </div>

            <div>
                <UserPerfil/>
            </div>

            <div>
                <Insignias/>
            </div>

        </div>
    )
}

export default ChatInfoPanel