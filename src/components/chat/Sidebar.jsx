import "./Sidebar.css"

function Sidebar(){
    let imagen="src/assets/images/A-1.jpg"
    return(
        <div className="sidebar">
            <input 
            className="search"
            placeholder="Busca un chat..." 
            />

            <div className="chat-user">
                <img src={imagen} alt="Img_User" />
                <div>
                    <p>User Name</p>
                    <span>Tú:Hola</span>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;