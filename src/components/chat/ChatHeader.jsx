import "./ChatHeader.css"

function ChatHeader(){
    let imagen="src/assets/images/A-1.jpg"
    return(
        <div className="chat-header">
            <div className="user-info">

                {/* cambiar por una variable la imagen src*/}
                <img src={imagen} alt="Img_User" />
                <div>
                    <h3>User Name</h3>
                    <span>Desconectado</span>
                </div>
            </div>

            <div className="icons">
                <span>📞</span>
                <span>🎥</span>
                <span>🔍</span>
            </div>

        </div>
    )
}

export default ChatHeader;