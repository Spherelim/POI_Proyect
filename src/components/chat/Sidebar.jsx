import PerfilCard from "./PerfilCard";
import ChatCard from "./ChatCard"

import "./Sidebar.css"

function Sidebar({cambiarVista}){
    
    let image="src/assets/images/A-1.jpg"
    let NombreUsuario="M_Chetto"
    let mensaje = "Tú:Hola"
    let Timepo = "11:02 p.m."

    return(
        <div className="sidebar">

            <PerfilCard cambiarVista={cambiarVista}/>

            <input 
            className="search"
            placeholder="Busca un chat..." 
            />

            {/* Es lo mismo que abajo pero como componente */}
            <ChatCard imagen={image} NomUser={NombreUsuario} ultmsg={mensaje} time={Timepo}
            abrirChat={()=>cambiarVista("chat")}
            />
            <ChatCard imagen={image} NomUser={NombreUsuario} ultmsg={mensaje} time={Timepo}
            abrirChat={()=>cambiarVista("chat")}
            />
            

            {/* <div className="chat-user">
                <img src={imagen} alt="Img_User" />
                <div>
                    <p>User Name</p>
                    <span>Tú:Hola</span>
                </div>
                <span className="time">Ayer</span>
            </div> */}

        </div>
    )
}

export default Sidebar;