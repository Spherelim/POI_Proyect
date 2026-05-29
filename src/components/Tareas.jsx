import Card_Tarea from "./Tareas/Card_Tarea"
import { useEffect, useState } from "react"

import { API_URL } from "../utils/api.js"

function Tareas(){
    const [tareas, setTareas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [puntosUsuario, setPuntosUsuario] = useState(0)
    
    const usuario = JSON.parse(localStorage.getItem("usuario"))

    useEffect(() => {
        // Obtener tareas
        fetch(`${API_URL}/tareas/${usuario.id}`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
                return res.json()
            })
            .then(data => {
                console.log("Datos recibidos:", data)
                setTareas(data)
                setLoading(false)
            })
            .catch(err => {
                console.error("Error:", err)
                setError(err.message)
                setLoading(false)
            })
        
        // Obtener puntos del usuario
        if (usuario && usuario.id) {
            fetch(`${API_URL}/usuarios/${usuario.id}/puntos`)
                .then(res => res.json())
                .then(data => {
                    setPuntosUsuario(data.puntos || 0)
                })
                .catch(err => console.error("Error al obtener puntos:", err))
        }
    }, [])

    if (loading) return <div style={{padding: "20px"}}>Cargando tareas...</div>
    if (error) return <div style={{padding: "20px"}}>Error: {error}</div>
    if (tareas.length === 0) return <div style={{padding: "20px"}}>No hay tareas disponibles</div>

    return(
        <>
            {/* Espacio superior */}
            <div style={{height: "10px"}}></div>
            
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
                        {puntosUsuario.toLocaleString()}
                    </p>
                </div>
                <div style={{fontSize: "48px"}}>⭐</div>
            </div>
            
            <div style={{
                padding: "20px",
                overflowY: "auto",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                flex: 1,
                minHeight: 0,
                scrollbarWidth: "none", /* Firefox */
                msOverflowStyle: "none" /* IE y Edge */
            }}>
                {tareas.map((tarea, index) => (
                    <Card_Tarea
                        key={index}
                        titulo={tarea.Titulo}
                        descripcion={tarea.Descripcion}
                        puntos={tarea.Puntos}
                        frecuencia={tarea.Frecuencia}
                        objetivo={tarea.Objetivo}
                        progreso={tarea.Progreso}
                        completada={tarea.Completada === "Completada" || tarea.Completada === 1}
                    />
                ))}
            </div>
        </>
    )
}

export default Tareas