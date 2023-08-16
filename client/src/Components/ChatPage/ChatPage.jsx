import React, { useState } from "react";
import "./ChatPage.css";

const ChatPage = ({ socket, newUsername, room }) => {
  const [ newRoom, setNewroom ] = useState('Lobbyn')


  const checkRoomInput = () => {
    console.log(newRoom)
    if (newRoom.trim() != "") {
      //sending username and room to the server(terminal).
      socket.emit("start_chat_with_room", newUsername, newRoom);
    } else {
      alert("Användarnamn får inte vara tomt.");
    }
  };
  
  return (
    <>
    <div className="chat-container">
    <header className="chat-header">
      <h1><i className="fas fa-smile"></i> ChatPage</h1>
    </header>
    <main className="chat-main">
      <div className="chat-sidebar">
        <h3><i className="fas fa-comments"></i> Room Name:</h3>
        <h2 id="room-name">
        <input
            type="text"
            placeholder={newRoom}
            onChange={(e) => setNewroom(e.target.value)}
          />
          <button onClick={checkRoomInput}>Skapa rum</button>
          </h2>
        <h3><i className="fas fa-users"></i> Users</h3>
        <ul id="users">
        </ul>
      </div>
      <div className="chat-messages"></div>
    </main>
    <div className="chat-form-container">
      <form>
        <input
          id="msg"
          type="text"
          placeholder="Enter Message"
          required
        />
        <button className="btn"><i className="fas fa-paper-plane"></i> Send</button>
      </form>
    </div>
    </div>
    
    </>
  );
};

export default ChatPage;
