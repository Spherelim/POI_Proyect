import "./SideInfo.css"

import Alert from "../Alert.jsx"
import { useState } from "react"

import InfoIcon from "/src/assets/icons/informacion (w).png"
import CerrarIcon from "/src/assets/icons/circulo-marca-x (w).png"

function SideInfo({cerrarInfo}){

    const [mostrarAlert,setMostrarAlert]=useState(false)

    let Titulo = "Información"

    return(
        <>
            <p className="Titulo">{Titulo}</p>

            <img src={CerrarIcon} alt="Cerrar" className="Close"
            onClick={cerrarInfo}/>

            <img src={InfoIcon} alt="Información" className="Info"
            onClick={()=>setMostrarAlert(true)} />

            {mostrarAlert &&(
                <Alert
                    Titulo="Información"
                    mensaje="Esta parte de la interfaz mostrará información relevante sobre el usuario o el chat actual. Aquí podrás ver detalles como su nombre, estado, y otras opciones relacionadas."
                    cerrar={()=>setMostrarAlert(false)}
                />
            )}
        </>
    )
}

export default SideInfo