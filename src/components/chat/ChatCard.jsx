import "./ChatCard.css"
import FavoritoIconFilled from "/src/assets/icons/corazon (w1).png"
import { usePersonalizacion } from "../../utils/personalizacion"

function ChatCard({ imagen, NomUser, ultmsg, time, esFavorito, abrirChat, idAmigo }) {
    const { personalizacion } = usePersonalizacion(idAmigo);
    const marco = personalizacion?.marco;
    const borderStyle = marco 
        ? `2px solid transparent; background: linear-gradient(white, white) padding-box, linear-gradient(135deg, ${marco.Color_1 || '#ccc'}, ${marco.Color_2 || '#ccc'}) border-box;`
        : '2px solid white';

    const AvatarDefault = () => (
        <svg width="45" height="45" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
    )

    return (
        <div className="Chat-Card" onClick={() => abrirChat()}>
            {imagen ? (
                <img src={imagen} alt="Img-User" style={{ border: borderStyle }} />
            ) : (
                <AvatarDefault />
            )}
            <div>
                <p>{NomUser}</p>
                <span>{ultmsg}</span>
            </div>
            {esFavorito && (
                <div className="favorito-icon">
                    <img src={FavoritoIconFilled} alt="Favorito" style={{ width: "16px", height: "16px" }} />
                </div>
            )}
            <span className="time">{time}</span>
        </div>
    )
}

export default ChatCard