import "./Message.css"

function Message({text, type, senderName}){
    return(
        <div style={{
            display: "flex", 
            flexDirection: "column", 
            alignSelf: type === "right" ? "flex-end" : "flex-start",
            maxWidth: "60%"
        }}>
            {senderName && type === "left" && (
                <span style={{
                    fontSize: "11px", 
                    color: "#a8a5e6", 
                    marginBottom: "2px", 
                    marginLeft: "8px",
                    fontWeight: "600"
                }}>
                    {senderName}
                </span>
            )}
            <div className={`message ${type}`} style={{maxWidth: "100%"}}>
                {text}
            </div>
        </div>
    )
}

export default Message;