import { useNavigate } from "react-router-dom"
import "./Hero-Home.css"

function Hero(){
    const navigate = useNavigate()

    const features = [
        { icon: "💬", title: "Chats en tiempo real", desc: "Mensajes instantáneos con tus amigos sin retrasos." },
        { icon: "👥", title: "Grupos ilimitados", desc: "Crea grupos, gestiona miembros y asigna administradores." },
        { icon: "📷", title: "Perfiles personalizados", desc: "Avatar, banner y estadísticas propias para cada usuario." },
        { icon: "🔔", title: "Notificaciones", desc: "Mantente al tanto de solicitudes de amistad y mensajes." },
    ]

    const devs = [
        { nombre: "Mauricio Eleuterio Ortiz Rodríguez", rol: "Frontend" },
        { nombre: "José Raúl Cortez Rico", rol: "Backend" },
        { nombre: "Ian Beil Pérez González", rol: "Backend" },
    ]

    return(
        <div className="home-wrapper">

            {/* Fondo decorativo */}
            <div className="home-fondo"></div>

            {/* ── HERO ── */}
            <section className="hero-section">
                <div className="hero-badge">✦ Chat en tiempo real</div>
                <h1 className="hero-title">Mundi<span>Chat</span></h1>
                <p className="hero-sub">
                    Conecta al instante con tus amigos, crea grupos y comparte momentos.<br/>
                    Simple, rápido y siempre contigo.
                </p>
                <div className="hero-actions">
                    <button className="btn-primary" onClick={() => navigate("/Login")}>
                        Iniciar Sesión
                    </button>
                    <button className="btn-secondary" onClick={() => navigate("/Singup")}>
                        Crear Cuenta
                    </button>
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section className="features-section">
                <h2 className="section-title">¿Qué puedes hacer?</h2>
                <div className="features-grid">
                    {features.map((f, i) => (
                        <div className="feature-card" key={i}>
                            <span className="feature-icon">{f.icon}</span>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── DEVELOPERS ── */}
            <section className="devs-section">
                <h2 className="section-title">Desarrollado por</h2>
                <div className="devs-grid">
                    {devs.map((d, i) => (
                        <div className="dev-card" key={i}>
                            <div className="dev-avatar">{d.nombre.charAt(0)}</div>
                            <div className="dev-info">
                                <strong>{d.nombre}</strong>
                                <span className={`dev-rol rol-${d.rol.toLowerCase()}`}>{d.rol}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <footer className="home-footer">
                © 2025 MundiChat · Proyecto académico 8° Semestre
            </footer>

        </div>
    )
}

export default Hero