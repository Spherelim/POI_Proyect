import "./Hero-Home.css"
import StartButton from "../components/StartButton"
import Developers from "./Developers"

function Hero(){
    return(
        <div className="Bienvenida">
            <h1>MundiChat!!</h1>

            <div className="tagline">
                Conecta a tiempo real con tus amigos aficionados
            </div>

            <div className="dev">

                <h2>DESARROLLADO POR:</h2>

                <p>MAURICIO ELEUTERIO ORTIZ RODRIGUEZ (FRONTEND)</p>
                <p>JOSE RAUL CORTEZ RICO (BACKEND)</p>
                <p>MAURICIO ELEUTERIO ORTIZ RODRIGUEZ (BACKEND)</p>
             </div>
            <Developers/>
            <StartButton/>
        </div>
    )
}

export default Hero