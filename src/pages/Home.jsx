import { useNavigate } from "react-router-dom"

//import NavBar from "../components/NavBar" //implementación de los componentes
import Hero from "../components/Hero-Home"
import Developers from "../components/Developers"
import StartButton from "../components/StartButton"
import MainLayout from "../layouts/MainLayout"

import "./Home.css"

function Home(){
    const navigate = useNavigate()

    return(
        <>

            <MainLayout>
                <Hero/>
                <Developers/>
                <StartButton/>
            </MainLayout>

            {/* <div style={styles.container}>
                <h1 style={styles.title}>MundiChat</h1>
                <p style={styles.text}>
                    Conecta en Tiempo Real Con tus Amigos Aficionados.
                </p>

                <button style={styles.button} onClick={()=>navigate("/Chat")}>
                    Entrar al Chat
                </button>

            </div> */}
        </>
    )
}

const styles ={
    container:{
        height: "100vh",
        background: "#1e1f2f",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        fontSize: "3rem"
    },
    text: {
        margin: "20px 0"
    },
    button: {
        padding: "12px 24px",
        fontSize: "1rem",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer"
    }
}

export default Home