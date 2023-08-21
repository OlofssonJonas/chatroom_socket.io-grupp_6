import React, { useEffect, useState } from "react";
import "./ChatPage.css";
import { useSocket } from "../../Context/ContextForSocket";
import Users from "../Users/Users";

const ChatPage = ({ newUsername, room }) => {
  const socket = useSocket(); //using socket from context!

  const [newRoom, setNewroom] = useState("Lobbyn");
  const [roomList, setRoomlist] = useState(["Lobbyn"]);
  const [currentRoom, setCurrentRoom] = useState("Lobbyn");
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [leaveChat, setLeaveChat] = useState(false);
  const [clientCount, setClientCount] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState("Lobbyn");
  const [ typingUsers, setTypingUsers] = useState([])

  useEffect(() => {
    socket.on('typing', (data) => {
      if(!typingUsers.includes(data.userId)) {
        setTypingUsers((prevUsers) => [...prevUsers, data.userId])
        setTimeout(() => {
          setTypingUsers((prevUsers) => prevUsers.filter(user => user !== data.userId))
        }, 3000)
      }
    })
  })

  console.log(roomList);
  console.log(currentRoom);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: newRoom,
        author: newUsername,
        msg: currentMessage,
        time: new Date(),
      };

      await socket.emit("send_message", messageData);
      console.log(messageData);
      //setMessageList((list) => [...list, messageData])
    }
  };

  const handdleTyping = () => {
    socket.emit('typing', {userId: 'senderUserId'})
  }
  
  

  const checkRoomInput = () => {
    console.log(newRoom);
    if (newRoom.trim() != "") {
      //sending username and room to the server(terminal).
      socket.emit("start_chat_with_room", newRoom);
      console.log(newRoom);
      setCurrentRoom(newRoom);
    } else {
      alert("Fältet får inte vara tomt.");
    }
  };

  const leaveRoom = () => {
    // console.log("Left chat");
    // socket.disconnect();
    // console.log("Socket disconnected:", socket.disconnected); //boolean proves cocket`s disconnect
    // setLeaveChat(true); //updating state
    socket.emit('leaveRoom', currentRoom)
  };

  const joinSelectedRoom = () => {
    if (selectedRoom.trim() != "") {
      socket.emit("start_chat_with_room", selectedRoom);
      setCurrentRoom(currentRoom);
    } else {
      alert("Du har inte valt ett rum!");
    }
  };

  //listens for rooms-list updates from server
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });

    socket.on("clientsInRoom", (qtyOfClients) => {
      setClientCount(qtyOfClients);
      console.log(`client count: ${qtyOfClients}`);
    });

    // return () => {
    //   socket.off('receive_message');
    //   //socket.off('clientsInRoom');
    // };
  }, [socket]);

  useEffect(() => {
    socket.on("roomList", (rooms) => {
      setRoomlist(rooms);
    });
  }, [socket]);

  return (
    <>
      {!leaveChat ? (
        <div className="chat-container">
          <header className="chat-header">
            <h1>
              <i className="fas fa-smile"></i> ChatPage
            </h1>
          </header>
          <button onClick={leaveRoom}>left room,</button>
          <input placeholder="is typing..."
          onKeyUp={handdleTyping}></input>
          <main className="chat-main">
            <div className="chat-sidebar">
              <h3>
                <i className="fas fa-comments"></i> Rumsnamn:
              </h3>
              <h2 id="room-name">
                <p>{currentRoom}</p>
                <label>Välj rum</label>
                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                >
                  {roomList.map((roomName, idx) => (
                    <option value={roomName} key={idx}>
                      {roomName}
                    </option>
                  ))}
                </select>
                <button onClick={joinSelectedRoom}>Gå in i rummet</button>{" "}
                {/* ifall ammars ej funkar */}
                {/* <button>Gå in i rummet</button> <br /> */}
                <button onClick={leaveRoom}>Lämna chatten</button>
                <input
                  type="text"
                  value={newRoom}
                  onChange={(e) => setNewroom(e.target.value)}
                />
                <button onClick={checkRoomInput}>Skapa rum</button>
              </h2>
              <h3>
                <i className="fas fa-users"></i> Användare:
              </h3>
              <ul id="users">
                <li>{newUsername}</li>
              </ul>
              <p>Användare i rummet: {clientCount}</p>
            </div>
            <div className="chat-messages">
              {/* Här borde meddelande skrivas ut */}
              {messageList.map((messageContent, idx) => (
                <p key={idx}>
                  klockan {messageContent.time} skrev {messageContent.author}:{" "}
                  {messageContent.msg}
                </p>
              ))}
            </div>
          </main>
          <div className="chat-form-container">
            <input
              id="msg"
              type="text"
              placeholder="Ange meddelande"
              onChange={(e) => setCurrentMessage(e.target.value)}
              required
            />
            <button onClick={sendMessage} className="btn">
              Skicka
            </button>
          </div>
        </div>
      ) : (
        <Users />
      )}
    </>
  );
};

export default ChatPage;
