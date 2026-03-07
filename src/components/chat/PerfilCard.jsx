import "./PerfilCard.css"

function PerfilCard({cambiarVista}){

    let PerfImg = "/src/assets/images/descarga (1).jpg"

    const Ajustes = "/src/assets/icons/ajustes (w).png"
    const Noti = "/src/assets/icons/Notificación/campana (w).png"
    const Tareas = "/src/assets/icons/Lista-Tareas(w).png"
    const Solicitud = "/src/assets/icons/Contactos/agregar-usuario (w).png"


    return(
        <div className="Perfil-Card">
            <img src={PerfImg} alt="Imagen De Perfil" 
            id="Perfil-Img"
            />

            <img src={Ajustes} alt="Setings"
            onClick={()=>cambiarVista("ajustes")}
            />
            <img src={Noti} alt="Notify" 
            onClick={()=>cambiarVista("noti")}
            />
            <img src={Tareas} alt="HomeWorks" 
            onClick={()=>cambiarVista("tareas")}
            />
            <img src={Solicitud} alt="Friends" 
            onClick={()=>cambiarVista("soli")}
            />
        </div>
    )
}

export default PerfilCard