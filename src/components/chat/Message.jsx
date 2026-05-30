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

        const esUbicacionPorRegex = typeof text === "string" && /^(-?\d+\.\d+),(-?\d+\.\d+)$/.test(text.trim())

        if (tipo === "ubicacion" || esUbicacionPorRegex) {
            let lat = 0
            let lng = 0
            const coordsMatch = text.match(/(-?\d+\.\d+),(-?\d+\.\d+)/)
            if (coordsMatch) {
                lat = parseFloat(coordsMatch[1])
                lng = parseFloat(coordsMatch[2])
            }

            const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`
            const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.003}%2C${lat - 0.003}%2C${lng + 0.003}%2C${lat + 0.003}&layer=mapnik&marker=${lat}%2C${lng}`

            return (
                <div className="msg-ubicacion-container">
                    {lat !== 0 && lng !== 0 ? (
                        <iframe 
                            title="Mapa de Ubicación"
                            width="100%" 
                            height="160" 
                            frameBorder="0" 
                            scrolling="no" 
                            marginHeight="0" 
                            marginWidth="0" 
                            src={osmEmbedUrl}
                            style={{ border: 'none', borderRadius: '12px', marginBottom: '8px', pointerEvents: 'none' }}
                        />
                    ) : null}
                    <a 
                        href={googleMapsUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="msg-ubicacion-link"
                    >
                        <span className="msg-location-icon">📍</span>
                        <span className="msg-location-text">Ver en Google Maps</span>
                    </a>
                </div>
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