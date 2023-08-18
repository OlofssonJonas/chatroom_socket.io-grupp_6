import React, { useEffect, useState } from "react";
import "./ChatPage.css";
import { useSocket } from "../../Context/ContextForSocket";
import Users from "../Users/Users";




import Users from "../Users/Users";


const ChatPage = ({ newUsername, room }) => {
  const socket = useSocket(); //using socket from context!


  const [ newRoom, setNewroom ] = useState('Lobbyn')
  const [ roomList, setRoomlist ] = useState(['Lobbyn'])
  const [ currentMessage, setCurrentMessage ] = useState('')
  const [ messageList, setMessageList ] = useState([])
  const [ leaveChat, setLeaveChat ] = useState(false)

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: newRoom,
        author: newUsername,
        msg: currentMessage,
        time: new Date(),
      };

      await socket.emit("send_message", messageData);
    }
  }

 
  //listens for rooms-list updates from server
  useEffect(() => {
    socket.on("roomList", (rooms) => {
      setRoomlist(rooms);
    });
  }, []);


  useEffect(() => {
      socket.on('receive_message', (data) => {
       setMessageList((list) => [...list, data])

      })
  }, [socket])


  const checkRoomInput = () => {
    console.log(newRoom);
    if (newRoom.trim() != "") {
      //sending username and room to the server(terminal).
      socket.emit("start_chat_with_room", newRoom);
    } else {
      alert("Fältet får intae vara tomt.");
    }
  };

  const leaveRoom = () => {
    console.log('Left chat')
    socket.disconnect()
    console.log('Socket disconnected:', socket.disconnected) //boolean proves cocket`s disconnect
    setLeaveChat(true) //updating state
  }
  
  return (
    <>
    {!leaveChat ? (

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
           {/* Mapping over roomList to display room names */}
          {roomList.map((roomName, index) => (
            <li key={index}>{roomName}</li>
            ))}
          </ul>
        <input
            type="text"
            value={newRoom}
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
    ) : (
      <Users />
    )}
    
    </>
    );
  };
  
  export default ChatPage;
