import "./Alert.css"

function Alert({ Titulo, mensaje, cerrar, onConfirm }) {
    return (
        <div className="Container_Msg">
            <div className="Message">
                <h2>{Titulo}</h2>
                <p>{mensaje}</p>
                <div className="AlertButtons">
                    <button className="btn-cancelar" onClick={cerrar}>Cancelar</button>
                    <button className="btn-confirmar" onClick={onConfirm}>Confirmar</button>
                </div>
            </div>
        </div>
    )
}

export default Alert