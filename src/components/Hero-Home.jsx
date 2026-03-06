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
            <Developers/>
            <StartButton/>
        </div>
    )
}

export default Hero