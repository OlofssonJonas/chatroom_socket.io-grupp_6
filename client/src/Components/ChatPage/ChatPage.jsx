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
    console.log("Left chat");
    socket.disconnect();
    console.log("Socket disconnected:", socket.disconnected); //boolean proves cocket`s disconnect
    setLeaveChat(true); //updating state
  };

  const joinSelectedRoom = () => {
    if (selectedRoom.trim() != "") {
      socket.emit("start_chat_with_room", selectedRoom);
      setCurrentRoom(selectedRoom);
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
          <main className="chat-main">
            <div className="chat-sidebar">
              <h3>
                <i className="fas fa-comments"></i> Room Name:
              </h3>
              <h2 id="room-name">
                <p>{currentRoom}</p>
                <label>Select</label>
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
                {/* //Ammar */}
                <button onClick={joinSelectedRoom}>Gå in i rummet</button>{" "}
                {/* Ammar Slut */}
                {/* ifall ammars ej funkar */}
                {/* <button>Gå in i rummet</button> <br /> */}
                <button onClick={leaveRoom}>Leave room</button>
                <input
                  type="text"
                  value={newRoom}
                  onChange={(e) => setNewroom(e.target.value)}
                />
                <button onClick={checkRoomInput}>Skapa rum</button>
              </h2>
              <h3>
                <i className="fas fa-users"></i> User:
              </h3>
              <ul id="users">
                <li>{newUsername}</li>
              </ul>
              <p>Number of clients in room: {clientCount}</p>
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
              placeholder="Enter Message"
              onChange={(e) => setCurrentMessage(e.target.value)}
              required
            />
            <button onClick={sendMessage} className="btn">
              Send
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
