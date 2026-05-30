import "./Message.css"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

function Message({ text, type, senderName, tipo, archivo }) {

    const renderContenido = () => {
        // Si el archivo ya es una URL completa (Cloudinary), la usamos directo, si no le concatenamos el API_URL local
        const URLCompleta = archivo && (archivo.startsWith("http://") || archivo.startsWith("https://") || archivo.startsWith("blob:"))
            ? archivo 
            : `${API_URL}${archivo}`

        if (tipo === "imagen" && archivo) {
            return (
                <a href={URLCompleta} target="_blank" rel="noopener noreferrer">
                    <img
                        src={URLCompleta}
                        alt={text}
                        className="msg-imagen"
                        onError={(e) => { e.target.style.display = "none" }}
                    />
                </a>
            )
        }

        if (tipo === "archivo" && archivo) {
            const ext = archivo.split(".").pop().toUpperCase()
            return (
                <a
                    href={URLCompleta}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="msg-archivo"
                    download
                >
                    <span className="msg-archivo-icon">📎</span>
                    <span className="msg-archivo-nombre">{text}</span>
                    <span className="msg-archivo-ext">{ext}</span>
                </a>
            )
        }

        // Mensaje de texto normal
        return text
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignSelf: type === "right" ? "flex-end" : "flex-start",
            maxWidth: tipo === "imagen" ? "70%" : "60%"
        }}>
            {senderName && type === "left" && (
                <span className="msg-sender-name">
                    {senderName}
                </span>
            )}
            <div
                className={`message ${type} ${tipo === "imagen" ? "message-img" : ""}`}
                style={{ maxWidth: "100%", padding: tipo === "imagen" ? "4px" : undefined }}
            >
                {renderContenido()}
            </div>
        </div>
    )
}

export default Message