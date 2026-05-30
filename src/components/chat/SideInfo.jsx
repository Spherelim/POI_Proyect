import "./SideInfo.css"
import CerrarIcon from "/src/assets/icons/circulo-marca-x (w).png"

function SideInfo({cerrarInfo}){
    let Titulo = "Información"

    return(
        <>
            <p className="Titulo">{Titulo}</p>

            <img src={CerrarIcon} alt="Cerrar" className="Close"
            onClick={cerrarInfo}/>
        </>
    )
}

export default SideInfo