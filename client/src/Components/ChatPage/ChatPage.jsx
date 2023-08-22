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

  useEffect(() => {
    socket.on("typing", (data) => {
      if (!typingUsers.includes(data.userId)) {
        setTypingUsers((prevUsers) => [...prevUsers, data.userId]);
        setTimeout(() => {
          setTypingUsers((prevUsers) =>
            prevUsers.filter((user) => user !== data.userId)
          );
        }, 3000);
      }
    });
  });

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
    socket.emit("typing", { userId: "senderUserId" });
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

  return (
    <>
      {!leaveChat ? (
        <div className="chat-container">
          <header className="chat-header">
            <h1>
              <i className="fas fa-smile"></i> Chat
            </h1>
            <button class="leaveBtn" onClick={LeaveChat}>
              Leave, bye!
            </button>
          </header>
          <button onClick={leaveRoom}>left room,</button>
          <input placeholder="is typing..." onKeyUp={handdleTyping}></input>
          <main className="chat-main">
            <div className="chat-sidebar">
              <h5>
                in chat as: {newUsername}
                {/* <ul id="users">
                <li>{newUsername}</li>
              </ul> */}
              </h5>
              <hr></hr>
              <h5>
                <i className="fas fa-comments"></i> in room: {currentRoom}
              </h5>
              <hr></hr>
              <br></br>
              {/* <h5>change room</h5> */}
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
              <br></br>
              <button onClick={joinSelectedRoom}>Switch room</button>{" "}
              <h2 id="room-name">
                {/* <p>{currentRoom}</p> */}
               
                <br></br>
                <input
                  type="text"
                  value={newRoom}
                  onChange={(e) => setNewroom(e.target.value)}
                />
                <button onClick={checkRoomInput}>create new room</button>
              </h2>
              {/* <p>Användare i rummet: {clientCount}</p> */}
            </div>
            <div className="chat-messages">
              <p class="usersInRoom">Active users {clientCount}</p>
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
                  placeholder="message.."
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
