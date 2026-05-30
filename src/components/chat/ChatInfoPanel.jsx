import "./ChatInfoPanel.css"

import SideInfo from "./SideInfo"
import UserPerfil from "./UserPerfil"
import GroupPerfil from "./GroupPerfil"
import Insignias from "./Insignias"

// Agregados
import { usePersonalizacion } from "../../utils/personalizacion.js"

function ChatInfoPanel({cerrarInfo, amigo, usuarioActualId, alSalirGrupo}){

    //Agragados - Personalización
    const { personalizacion } = usePersonalizacion(amigo?.ID_Us)
    const color = personalizacion?.color
    const mosaico = personalizacion?.mosaico

    const panelStyle = {}
    if (color) {
        panelStyle.background = `linear-gradient(135deg, ${color.Color_1}, ${color.Color_2})`
    } else if (mosaico && mosaico.Mosaico) {
        const url = mosaico.Mosaico.startsWith('http') ? mosaico.Mosaico : `/${mosaico.Mosaico}`
        panelStyle.backgroundImage = `url(${url})`
        panelStyle.backgroundSize = 'cover'
        panelStyle.backgroundPosition = 'center'
    }

    return(
        <div className="chat-info-panel" style={panelStyle}>

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
                        {/* <Insignias/> */}
                    </>
                )}
            </div>

        </div>
    )
}

export default ChatInfoPanel