import "./ChatInfoPanel.css"

import SideInfo from "./SideInfo"
import UserPerfil from "./UserPerfil"
import GroupPerfil from "./GroupPerfil"
import Insignias from "./Insignias"

function ChatInfoPanel({cerrarInfo, amigo, usuarioActualId, alSalirGrupo}){
    return(
        <div className="chat-info-panel">
            
            <div className="info-header">
                <SideInfo cerrarInfo={cerrarInfo}/>
            </div>

            <div>
                {amigo.esGrupo ? (
                    <GroupPerfil 
                        grupo={amigo} 
                        usuarioActualId={usuarioActualId} 
                        alSalirGrupo={() => {
                            cerrarInfo();
                            if (alSalirGrupo) alSalirGrupo();
                        }}
                    />
                ) : (
                    <UserPerfil amigo={amigo} usuarioActualId={usuarioActualId}/>
                )}
            </div>

            <div>
                {!amigo.esGrupo && <Insignias/>}
            </div>

        </div>
    )
}

export default ChatInfoPanel