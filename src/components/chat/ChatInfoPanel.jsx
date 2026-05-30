import "./ChatInfoPanel.css"

import SideInfo from "./SideInfo"
import UserPerfil from "./UserPerfil"
import GroupPerfil from "./GroupPerfil"
import Insignias from "./Insignias"

function ChatInfoPanel({cerrarInfo, amigo, usuarioActualId, alSalirGrupo}){
    return(
        <div className="chat-info-panel">

            {/* Header fijo — siempre visible */}
            <div className="info-header">
                <SideInfo cerrarInfo={cerrarInfo}/>
            </div>

            {/* Contenido scrollable — ocupa el espacio restante */}
            <div className="info-body">
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
                    <>
                        <UserPerfil amigo={amigo} usuarioActualId={usuarioActualId}/>
                        <Insignias/>
                    </>
                )}
            </div>

        </div>
    )
}

export default ChatInfoPanel