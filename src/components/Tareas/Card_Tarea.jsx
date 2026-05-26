import "./Card_Tarea.css"

function Card_Tarea({
    titulo,
    descripcion,
    puntos,
    frecuencia,
    objetivo
}){

    return(
        <div className="Container_Card">
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
            <div className="Detalles_Tarea">
                <span>Objetivo: {objetivo || "N/A"}</span>
                <span>Frecuencia: {frecuencia || "N/A"}</span>
            </div>
        </div>
    )
}

export default Card_Tarea