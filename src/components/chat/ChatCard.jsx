import "./ChatCard.css"

function ChatCard({imagen, NomUser, ultmsg, time, abrirChat}){
    
    const AvatarDefault = () => (
        <svg width="45" height="45" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
    )

    return(
        <div className="Chat-Card" onClick={() => abrirChat()}>
            {imagen ? <img src={imagen} alt="Img-User" /> : <AvatarDefault/>}
            <div>
                <p>{NomUser}</p>
                <span>{ultmsg}</span>
            </div>
            <span className="time">{time}</span>
        </div>
    )
}

export default ChatCard