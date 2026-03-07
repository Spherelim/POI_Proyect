import "./UserPerfil.css"

import Alert from "../Alert"
import { useState } from "react"

function UserPerfil(){

    const [AlertData,setMostrarAlert]=useState(false)

    let PerfilImg = "/src/assets/images/A-1.jpg"
    let BannerPerfil = "/src/assets/images/Banner 10.png"
    let UserName = "User Name"
    let Descripcion = "Hola Amigos De Youtube."
    let FechaIngreso = "Se Unio el 10 Ene 2026"

    let favorito = "/src/assets/icons/corazon (w).png"
    let eliminar = "/src/assets/icons/Contactos/eliminar-usuario (w).png"
    let bloquear = "/src/assets/icons/prohibicion (w).png"
    let sileciar = "/src/assets/icons/Notificación/campana 1 (w).png"

    return(
        <>
            

            <div className="Perfil-User">
                <img className="banner" src={BannerPerfil} alt="Banner" />
                <img className="avatar" src={PerfilImg} alt="Foto Perfil" />


                {/* que mugrero DIOS!! */}
                <div className="acciones">

                    <div className="accionesUno">
                        <img src={favorito} alt="Favrito" className="Favorito" 
                        onClick={()=>setMostrarAlert(true)}/>
                        <img src={eliminar} alt="EliminarUs" className="Eliminar"
                        onClick={()=>setMostrarAlert(true)}/>
                    </div>

                    <div className="accionesDos">
                        <img src={bloquear} alt="BloquearUs" className="Bloquear"
                        onClick={()=>setMostrarAlert(true)}/>
                        <img src={sileciar} alt="sileciarUs" className="Silenciar"
                        onClick={()=>setMostrarAlert(true)}/>
                    </div>

                </div>                

                <p className="NombreUs">{UserName}</p>
                <p className="Descrip">{Descripcion}</p>

                <div className="Fecha">
                    <p className="FechaIngreso">{FechaIngreso}</p>
                </div>

            </div>

            {AlertData &&(
                <Alert
                    Titulo="Acción"
                    mensaje="Mostrar Mensaje de Acción"
                    cerrar={()=>setMostrarAlert(false)}
                />
            )}
        </>
    )
}

export default UserPerfil