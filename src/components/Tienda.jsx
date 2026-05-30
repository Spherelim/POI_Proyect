import "./Tienda.css"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

function Tienda() {
    const usuario = JSON.parse(localStorage.getItem("usuario"))
    const [items, setItems] = useState([])
    const [puntos, setPuntos] = useState(0)
    const [loading, setLoading] = useState(true)
    const [comprandoId, setComprandoId] = useState(null)

    useEffect(() => {
        if (!usuario?.id) return
        cargarDatos()
    }, [])

    const cargarDatos = async () => {
        try {
            // 1. Obtener inventario del usuario (IDs de ítems que ya posee)
            const resInventario = await fetch(`${API_URL}/inventario/${usuario.id}`)
            let inventarioIds = new Set()
            if (resInventario.ok) {
                const inventario = await resInventario.json()
                inventarioIds = new Set(inventario.map(item => item.ID_Item))
            }

            // 2. Obtener todos los ítems de la tienda
            const resItems = await fetch(`${API_URL}/items`)
            const dataItems = await resItems.json()

            // 3. Filtrar solo los ítems que NO están en el inventario
            const itemsDisponibles = dataItems.filter(item => !inventarioIds.has(item.ID_Item))
            setItems(itemsDisponibles)

            // 4. Obtener puntos actuales
            const resPuntos = await fetch(`${API_URL}/usuarios/${usuario.id}/puntos`)
            const dataPuntos = await resPuntos.json()
            setPuntos(dataPuntos.puntos || 0)
        } catch (error) {
            console.error("Error cargando tienda:", error)
            toast.error("No se pudieron cargar los productos")
        } finally {
            setLoading(false)
        }
    }

    const comprarItem = async (item) => {
        if (puntos < item.Precio) {
            toast.error(`No tienes suficientes puntos. Te faltan ${item.Precio - puntos} puntos.`)
            return
        }
        setComprandoId(item.ID_Item)
        try {
            const res = await fetch(`${API_URL}/comprar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idUsuario: usuario.id,
                    idItem: item.ID_Item
                })
            })
            const data = await res.json()
            if (res.ok) {
                toast.success(`¡Has canjeado ${item.Nombre}!`)
                // Recargar datos para actualizar puntos y lista de ítems
                await cargarDatos()
            } else {
                toast.error(data.error || "Error al realizar la compra")
            }
        } catch (error) {
            console.error(error)
            toast.error("Error de conexión")
        } finally {
            setComprandoId(null)
        }
    }

    const getMosaicoUrl = (path) => {
        if (!path) return ''
        if (path.startsWith('http')) return path
        // Asumimos que las imágenes están en la carpeta public/assets/images/
        return `/${path}`
    }

    if (loading) {
        return <div className="tienda-loading">Cargando tienda...</div>
    }

    return (
        <div className="tienda-container">
            {/* Barra de puntos */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px 20px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "15px",
                margin: "0 20px 20px 20px",
                color: "white"
            }}>
                <div>
                    <h3 style={{margin: 0, fontSize: "18px", opacity: 0.9}}>Tus Puntos</h3>
                    <p style={{margin: "5px 0 0 0", fontSize: "32px", fontWeight: "bold"}}>
                        {puntos.toLocaleString()}
                    </p>
                </div>
                <div style={{fontSize: "48px"}}>⭐</div>
            </div>

            {/* Encabezado de la tienda */}
            <div className="tienda-header glass-effect">
                <h2>Tienda de Recompensas</h2>
                <p>Canjea tus puntos por objetos exclusivos</p>
            </div>

            <div className="items-grid">
                {items.length === 0 ? (
                    <p className="no-items">Próximamente más recompensas...</p>
                ) : (
                    items.map(item => (
                        <div key={item.ID_Item} className="item-card glass-effect">
                            {/* Previsualización según el tipo */}
                            <div className="item-preview">
                                {item.Tipo === 'color' && (
                                    <div
                                        className="preview-color"
                                        style={{
                                            background: `linear-gradient(135deg, ${item.Color_1 || '#cccccc'}, ${item.Color_2 || '#888888'})`
                                        }}
                                    />
                                )}
                                {item.Tipo === 'marco' && (
                                    <div className="preview-marco">
                                        <img
                                            src="/src/assets/images/default-avatar.png"
                                            alt="Avatar ejemplo"
                                            className="preview-avatar"
                                            style={{
                                                border: `4px solid transparent`,
                                                background: `linear-gradient(white, white) padding-box, linear-gradient(135deg, ${item.Color_1 || '#FFD700'}, ${item.Color_2 || '#FFA500'}) border-box`
                                            }}
                                        />
                                    </div>
                                )}
                                {item.Tipo === 'mosaico' && (
                                    <div
                                        className="preview-mosaico"
                                        style={{
                                            backgroundImage: `url(${getMosaicoUrl(item.Mosaico)})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }}
                                    />
                                )}
                            </div>

                            <h3>{item.Nombre}</h3>
                            <p className="item-tipo">{item.Tipo}</p>
                            <div className="item-precio">
                                <span>{item.Precio}</span>
                                <span className="punto-estrella">⭐</span>
                            </div>
                            <button
                                className="btn-comprar"
                                onClick={() => comprarItem(item)}
                                disabled={comprandoId === item.ID_Item || puntos < item.Precio}
                            >
                                {comprandoId === item.ID_Item ? "Canjeando..." : "Canjear"}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Tienda