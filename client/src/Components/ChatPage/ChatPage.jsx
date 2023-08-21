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
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIstyping] = useState(false);

  // console.log(roomList);
  // console.log(currentRoom);

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
      leaveRoom();
    } else {
      alert("Fältet får inte vara tomt.");
    }
  };

  const LeaveChat = () => {
    console.log("Left chat");
    socket.disconnect();
    console.log("Socket disconnected:", socket.disconnected); //boolean proves cocket`s disconnect
    setLeaveChat(true); //updating state
    leaveRoom();
    setMessageList([]);
  };

  const leaveRoom = () => {
    socket.emit("leaveRoom", currentRoom);
  };

  const joinSelectedRoom = () => {
    if (selectedRoom.trim() != "") {
      socket.emit("start_chat_with_room", selectedRoom);
      // setCurrentRoom(currentRoom);
      setCurrentRoom(selectedRoom);
      leaveRoom();
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
  const handleInputChange = (event) => {
    if (event.target.value !== "") {
      socket.emit("typing", { room: currentRoom, userId: newUsername });
    } else {
      socket.emit("stopTyping", { room: currentRoom, userId: newUsername });
    }
  };
  useEffect(() => {
    let typingTimeout;
    socket.on("userTyping", (data) => {
      if (!typingUsers.includes(data.userId)) {
        setTypingUsers((prevUsers) => [...prevUsers, data.userId]);
        console.log("User typing:", data.userId);
        setIstyping(true);
      }
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        setIstyping(false);
      }, 2000);
    });

    socket.on("userStoppedTyping", (data) => {
      setTypingUsers((prevUsers) =>
        prevUsers.filter((user) => user !== data.userId)
      );
      console.log("User stopped typing:", data.userId);
      setIstyping(false);
    });
  }, [socket, isTyping, clearTimeout]);

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
                <button onClick={LeaveChat}>Lämna chatten</button>
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
              onChange={(e) => {
                setCurrentMessage(e.target.value);
                handleInputChange(e);
              }}
              required
            />
            <button onClick={sendMessage} className="btn">
              Skicka
            </button>
            {isTyping && <p>Someone is typing...</p>}
          </div>
        </div>
      ) : (
        <Users />
      )}
    </>
  );
};

export default ChatPage;
