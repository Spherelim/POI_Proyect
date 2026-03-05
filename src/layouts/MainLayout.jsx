import NavBar from "../components/NavBar";

function MainLayout({children}){
    return(
        <div className="layout">

            <NavBar/>

            <main>
                {children}
            </main>

        </div>
    )
}

export default MainLayout