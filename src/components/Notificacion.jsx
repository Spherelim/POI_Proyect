import { useState, useEffect } from "react";
import "./Notificacion.css";
import FotoDefault from "/src/assets/images/Conejito.jpg";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Notificacion({ seleccionarAmigo, cambiarVista }) {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const [notificaciones, setNotificaciones] = useState([]);
    const [cargando, setCargando] = useState(true);

    const formatRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return "Justo ahora";
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `Hace ${diffInHours} h`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays === 1) return "Ayer";
        return `Hace ${diffInDays} días`;
    };

    const fetchNotificaciones = async () => {
        if (!usuario?.id) return;
        try {
            const res = await fetch(`${API_URL}/notificaciones/${usuario.id}`);
            const data = await res.json();
            setNotificaciones(data);
            
            if (data.some(n => n.leido === 0)) {
                await fetch(`${API_URL}/notificaciones/leer/${usuario.id}`, { method: "PUT" });
                window.dispatchEvent(new Event("notificaciones-leidas"));
            }
        } catch (error) {
            console.error("Error al obtener notificaciones:", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        fetchNotificaciones();

        // Escuchar si entra una nueva notificación mientras la bandeja ya está abierta
        const handleNuevaNoti = () => {
            fetchNotificaciones();
        };
        window.addEventListener("actualizar-bandeja", handleNuevaNoti);

        return () => window.removeEventListener("actualizar-bandeja", handleNuevaNoti);
    }, []);

    const handleClicNotificacion = async (noti) => {
        // Redirigir al chat SOLO si es un mensaje (si es solicitud, llamada rechazada, etc. no se abre el chat)
        if (seleccionarAmigo && cambiarVista && (noti.tipo === "mensaje" || noti.tipo === "llamada" || noti.tipo === "mensaje_grupo")) {
            
            if (noti.tipo === "mensaje_grupo") {
                try {
                    const payload = JSON.parse(noti.mensaje);
                    seleccionarAmigo({
                        ID_Conversacion: payload.idGrupo,
                        nombreGrupo: payload.nombreGrupo,
                        esGrupo: true 
                    });
                } catch (e) {
                    console.error("Error al parsear grupo", e);
                }
            } else {
                seleccionarAmigo({
                    ID_Us: noti.id_emisor,
                    nombreUsuario: noti.emisorNombre,
                    foto: noti.emisorFoto ? `${API_URL}${noti.emisorFoto}` : FotoDefault,
                    esGrupo: false 
                });
            }
            cambiarVista("chat");
        }

        // Eliminarla para que no siga saliendo
        try {
            await fetch(`${API_URL}/notificaciones/eliminar/${noti.id_notificacion}`, { method: "DELETE" });
            setNotificaciones(prev => prev.filter(n => n.id_notificacion !== noti.id_notificacion));
        } catch (error) {
            console.error("Error al eliminar notificación:", error);
        }
    };

    const getIconoPorTipo = (tipo) => {
        switch(tipo) {
            case "mensaje": return "💬";
            case "solicitud": return "👋";
            case "aceptado": return "🤝";
            case "rechazado": return "💔";
            case "llamada": return "📞";
            default: return "🔔";
        }
    };

    if (cargando) {
        return (
            <div className="Container" style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
                <p style={{color: "rgba(255,255,255,0.5)"}}>Cargando...</p>
            </div>
        );
    }

    return (
        <div className="Notificaciones-Container" style={{ padding: "10px 20px", display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto" }}>
            {notificaciones.length === 0 ? (
                <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginTop: "40px", opacity: 0.6}}>
                    <span style={{fontSize: "40px", marginBottom: "10px"}}>📭</span>
                    <p style={{color: "white"}}>No tienes notificaciones aún</p>
                </div>
            ) : (
                notificaciones.map((noti) => (
                    <div 
                        key={noti.id_notificacion} 
                        onClick={() => handleClicNotificacion(noti)}
                        style={{
                            display: "flex", 
                            alignItems: "center", 
                            padding: "15px", 
                            background: "rgba(30, 32, 40, 0.8)", // Fondo mucho más oscuro y opaco para súper contraste
                            borderRadius: "12px",
                            borderLeft: noti.leido === 0 ? "4px solid #4ade80" : "4px solid transparent",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
                            cursor: "pointer",
                            gap: "15px",
                            transition: "all 0.2s ease",
                            position: "relative"
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(45, 48, 60, 0.9)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(30, 32, 40, 0.8)"; e.currentTarget.style.transform = "translateY(0)"; }}
                    >
                        <div style={{ position: "relative", flexShrink: 0 }}>
                            <img 
                                src={noti.emisorFoto ? `${API_URL}${noti.emisorFoto}` : FotoDefault} 
                                alt="Emisor" 
                                style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.1)" }}
                            />
                            <div style={{
                                position: "absolute",
                                bottom: "-4px",
                                right: "-4px",
                                background: "#111",
                                borderRadius: "50%",
                                width: "24px",
                                height: "24px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "12px",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
                                border: "1px solid rgba(255,255,255,0.1)"
                            }}>
                                {getIconoPorTipo(noti.tipo)}
                            </div>
                        </div>

                        <div style={{ flex: 1 }}>
                            <h4 style={{ margin: "0 0 5px 0", color: "#ffffff", fontSize: "15px", fontWeight: "600", letterSpacing: "0.3px" }}>
                                {noti.emisorNombre}
                            </h4>
                            <p style={{ margin: 0, color: "rgba(255, 255, 255, 0.85)", fontSize: "14px", lineHeight: "1.4" }}>
                                {noti.tipo === "mensaje_grupo" 
                                    ? (() => { try { return `Nuevos mensajes en ${JSON.parse(noti.mensaje).nombreGrupo}`; } catch(e) { return "Nuevos mensajes en grupo"; } })() 
                                    : noti.mensaje}
                            </p>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", flexShrink: 0 }}>
                            <span style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "12px" }}>
                                {formatRelativeTime(noti.fechaCreacion)}
                            </span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default Notificacion;