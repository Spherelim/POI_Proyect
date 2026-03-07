import "./ChatCard.css"

function ChatCard({imagen,NomUser,ultmsg,time,abrirChat}){
    return(
        <div className="Chat-Card" onClick={()=>abrirChat()}>
            <img src={imagen} alt="Img-User" />
            <div>
                <p>{NomUser}</p>
                <span>{ultmsg}</span>
            </div>
            <span className="time">{time}</span>
        </div>
    )
}

export default ChatCard