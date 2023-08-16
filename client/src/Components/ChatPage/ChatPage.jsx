import React, { useState } from "react";
import "./ChatPage.css";

const ChatPage = ({ socket, newUsername, room }) => {
  const [ newRoom, setNewroom ] = useState('')

  const checkRoomInput = () => {
    //console.log('hej')
    if (newRoom.trim() != "") {
      //sending username to server(terminal).
      //setNewroom('')
      socket.emit("start_chat_with_room", newUsername, newRoom);
    } else {
      alert("Användarnamn får inte vara tomt.");
    }
  };
  
  return (
    <>
        <div className="div1">
          <h1> Välkommen till {room} </h1>

          <input
            type="text"
            placeholder="Namn på nya rummet"
            value={newRoom}
            onChange={(e) => setNewroom(e.target.value)}
            
          
          />
          <button onClick={checkRoomInput}>Skapa rum</button>
          <li>{newUsername}</li>
        </div>
    </>
  );
};

export default ChatPage;
