import "./Card_Tarea.css"

function Card_Tarea({
    titulo,
    descripcion,
    puntos,
    frecuencia,
    objetivo,
    progreso = 0,
    completada = false
}){

    const porcentaje = (progreso / objetivo) * 100

    return(
        <div className={`Container_Card ${completada ? 'completada' : ''}`}>
            <div className="Info_Tarea">
                <div>
                    <h2>{titulo || "Sin título"}</h2>
                    <p>{descripcion || "Sin descripción"}</p>
                </div>
                <div className="Puntos">
                    <span>{puntos || 0}</span>
                    <span style={{fontSize: "35px"}}>⭐</span>
                </div>
            </div>
            
            {/* Barra de progreso */}
            <div className="ProgresoContainer">
                <div className="ProgresoHeader">
                    <span>Progreso: {progreso}/{objetivo}</span>
                    {completada && <span className="CompletadaBadge">✓ Completada</span>}
                </div>
                <div className="BarraProgreso">
                    <div 
                        className="BarraProgresoFill" 
                        style={{ width: `${Math.min(porcentaje, 100)}%` }}
                    />
                </div>
            </div>

            <div className="Detalles_Tarea">
                <span>Objetivo: {objetivo || "N/A"}</span>
                <span>Frecuencia: {frecuencia || "N/A"}</span>
            </div>
        </div>
    )
}

export default Card_Tarea