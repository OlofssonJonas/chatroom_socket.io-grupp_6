import React, { useEffect, useState } from "react";
import "./ChatPage.css";
import { useSocket } from "../../Context/ContextForSocket";

const ChatPage = ({ socket, newUsername, room }) => {
  const [ newRoom, setNewroom ] = useState('Lobbyn')
  const [ roomList, setRoomlist ] = useState(['Lobbyn'])
  const [ currentMessage, setCurrentMessage ] = useState('')
  const [ messageList, setMessageList ] = useState([])

  const sendMessage = async () => {
    if (currentMessage !== '') {
      const messageData = {
        room: newRoom,
        author: newUsername,
        msg: currentMessage,
           time:
          new Date()
      }

      await socket.emit('send_message', messageData);
    }
  }
 
  useEffect(() => {
    socket.on('roomList', (rooms) => {
      setRoomlist(rooms)
    })
  }, [])

  useEffect(() => {
      socket.on('receive_message', (data) => {
       setMessageList((list) => [...list, data])

      })
  }, [socket])

  const checkRoomInput = () => {
    console.log(newRoom)
    if (newRoom.trim() != "") {
      //sending username and room to the server(terminal).
      socket.emit("start_chat_with_room", newRoom);
    } else {
      alert("Fältet får inte vara tomt.");
    }
  };

  const leaveRoom = () => {
    console.log('leave')
  }
  
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
          <button onClick={leaveRoom}>Leave room</button>
          <ul>
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
      <div className="chat-messages">
        {/* Här borde meddelande skrivas ut */}
        {messageList.map((messageContent, idx) => (
          <p key={idx}>{messageContent.msg}</p>
        ))}
      </div>
    </main>
    <div className="chat-form-container">
      
        <input
          id="msg"
          type="text"
          placeholder="Enter Message"
          onChange={(e) => setCurrentMessage(e.target.value)}
          required
        />
        <button onClick={sendMessage} className="btn">Send</button>
      
    </div>
    </div>
    
    </>
  );
};

export default ChatPage;
