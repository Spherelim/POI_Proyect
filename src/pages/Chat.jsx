import "./Chat.css"

import Sidebar from "../components/chat/Sidebar"
import ChatHeader from "../components/chat/ChatHeader"
import ChatInput from "../components/chat/ChatInput"
import Message from "../components/chat/Message"

function Chat(){
    return (
        <div className="Content-Chat">
            <Sidebar/>

            <div className="Chat-area">
                
                <ChatHeader/>

                <Message text="Hola." type="left"/>
                <Message text="Hola." type="right"/>
            </div>

            <ChatInput/>

        </div>
    )
}

export default Chat