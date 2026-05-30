import "./ChatCard.css"
import FavoritoIconFilled from "/src/assets/icons/corazon (w1).png"  // importa el icono

function ChatCard({imagen, NomUser, ultmsg, time, esFavorito, abrirChat, unreadCount, activo}){
    
    const AvatarDefault = () => (
        <svg width="45" height="45" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
    )

    return(
        <div 
            className="Chat-Card" 
            onClick={() => abrirChat()} 
            style={{ 
                position: "relative",
                background: activo ? "rgba(102, 126, 234, 0.3)" : "transparent",
                borderLeft: activo ? "4px solid #667eea" : "4px solid transparent",
                transition: "all 0.2s"
            }}
        >
            {imagen ? <img src={imagen} alt="Img-User" /> : <AvatarDefault/>}
            <div style={{ flex: 1, overflow: "hidden" }}>
                <p style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{NomUser}</p>
                <span style={{ 
                    whiteSpace: "nowrap", 
                    overflow: "hidden", 
                    textOverflow: "ellipsis", 
                    display: "block",
                    color: unreadCount > 0 ? "#4ade80" : "rgba(255, 255, 255, 0.5)",
                    fontWeight: unreadCount > 0 ? "bold" : "normal"
                }}>
                    {ultmsg}
                </span>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                <span className="time" style={{ color: unreadCount > 0 ? "#4ade80" : "rgba(255, 255, 255, 0.5)" }}>{time}</span>
                
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {esFavorito && (
                        <div className="favorito-icon" style={{ margin: 0 }}>
                            <img src={FavoritoIconFilled} alt="Favorito" style={{width: "14px", height: "14px"}} />
                        </div>
                    )}
                    
                    {unreadCount > 0 && (
                        <div style={{
                            background: "#25D366", /* Verde estilo WhatsApp */
                            color: "white",
                            fontSize: "11px",
                            fontWeight: "bold",
                            borderRadius: "50%",
                            minWidth: "18px",
                            height: "18px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0 5px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                        }}>
                            {unreadCount}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ChatCard