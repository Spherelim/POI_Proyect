import "./Alert.css"

function Alert({Titulo,mensaje,cerrar}){
    return(
        <div className="Container_Msg">
            <div className="Message">
                <h2>{Titulo}</h2>
                <p>{mensaje}</p>
                <button onClick={cerrar}>cerrar</button>
            </div>
        </div>
    )
}

export default Alert;