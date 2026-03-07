import "./SideInfo.css"

import Alert from "../Alert.jsx"
import { useState } from "react"

function SideInfo({cerrarInfo}){

    const [mostrarAlert,setMostrarAlert]=useState(false)

    let Titulo = "Información"
    let InfoImg = "/src/assets/icons/informacion (w).png"
    let CerrarSide = "/src/assets/icons/circulo-marca-x (w).png"

    return(
        <>
            <p className="Titulo">{Titulo}</p>

            <img src={CerrarSide} alt="Cerrar" className="Close"
            onClick={cerrarInfo}/>

            <img src={InfoImg} alt="Información" className="Info"
            onClick={()=>setMostrarAlert(true)} />

            {mostrarAlert &&(
                <Alert
                    Titulo="Información"
                    mensaje="Mostrar Descripcion del Side"
                    cerrar={()=>setMostrarAlert(false)}
                />
            )}
        </>
    )
}

export default SideInfo