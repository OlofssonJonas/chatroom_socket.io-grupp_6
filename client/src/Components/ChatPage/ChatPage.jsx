import React, { useEffect, useState } from "react";
import "./ChatPage.css";
import { useSocket } from "../../Context/ContextForSocket";

const ChatPage = ({ newUsername, room }) => {
  const [ newRoom, setNewroom ] = useState('Lobbyn')
  const [ roomList, setRoomlist ] = useState(['Lobbyn'])

  //accessing socket-obj from context
  const socket = useSocket();
 
  //listens for rooms-list updates from server
  useEffect(() => {
    socket.on('roomList', (rooms) => {
      setRoomlist(rooms)
    })
  }, [])


  const checkRoomInput = () => {
    console.log(newRoom)
    if (newRoom.trim() != "") {
      //sending username and room to the server(terminal).
      socket.emit("start_chat_with_room", newRoom);
    } else {
      alert("Fältet får intae vara tomt.");
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
          {/* <p>{newRoom}</p> */}
          <ul>
           {/* Mapping over roomList to display room names */}
          {roomList.map((roomName, index) => (
            <li key={index}>{roomName}</li>
          ))}
          </ul>
        <input
            type="text"
            //placeholder={roomName}
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
