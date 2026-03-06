import "./ChatHeader.css"

function ChatHeader(){
    let imagen="/src/assets/images/A-1.jpg"
    const Llamar = "/src/assets/icons/Llamada/llamada-telefonica 1 (w).png"
    const VidLlamada = "/src/assets/icons/Llamada/video-camara-alt (w).png"
    const Buscar = "/src/assets/icons/busqueda (w).png"
    return(
        <div className="chat-header">
            <div className="user-info">

                {/* cambiar por una variable la imagen src*/}
                <img src={imagen} alt="Img_User" />
                <div>
                    <h3>User Name</h3>
                    <span className="status">Desconectado</span>
                </div>
            </div>

            <div className="icons">
                <img src={Llamar} alt="" />
                <img src={VidLlamada} alt="" />
                <img src={Buscar} alt="" />
            </div>

        </div>
    )
}

export default ChatHeader;