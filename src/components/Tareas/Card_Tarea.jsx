import "./Card_Tarea.css"

function Card_Tarea({titulo,descripcion,estado}){
    return(
        <div className="Container_Card">
            <h2>{titulo}</h2>
            <p>{descripcion}</p>
            <p>Estado: {estado}</p>
        </div>
    )
}

export default Card_Tarea;