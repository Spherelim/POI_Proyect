import "./ChatInput.css"

function ChatInput(){
    return(
        <div className="chat-input">
            <button>+</button>

            <input placeholder="Escribe algo..." />

            <button>🎤</button>

        </div>
    )
}

export default ChatInput;