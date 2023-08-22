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
      setMessageList([]);
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
    setMessageList([]);
  };

  const joinSelectedRoom = () => {
    if (selectedRoom.trim() != "") {
      socket.emit("start_chat_with_room", selectedRoom);
      setCurrentRoom(selectedRoom);
      leaveRoom();
    }
  };

  //listens for rooms-list updates from server
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });

    socket.on("clientsInRoom", (qtyOfClients) => {
      setClientCount(qtyOfClients);
      // console.log(`client count: ${qtyOfClients}`);
    });

    // Nikela?

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
      socket.emit("typing", { room: currentRoom, userId: newUsername }); //room för att skicka rätt rum
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
      }, 10000);
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
              <i className="fas fa-smile"></i> Chat
            </h1>
            <button className="leaveBtn" onClick={LeaveChat}>
              Leave chat, bye!
            </button>
          </header>
          <main className="chat-main">
            <div className="chat-sidebar">
              <h5>In chat as: {newUsername}</h5>
              <hr></hr>
              <h5>
                <i className="fas fa-comments"></i> In room: {currentRoom}
              </h5>
              <hr></hr>
              <br></br>
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
                <br></br>
                <input
                  type="text"
                  value={newRoom}
                  onChange={(e) => setNewroom(e.target.value)}
                />
                <button onClick={checkRoomInput}>Create new room</button>
              </h2>
            </div>
            <div className="chat-messages">
              <p className="usersInRoom">Active users {clientCount}</p>
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
              placeholder="message..."
              onChange={(e) => {
                setCurrentMessage(e.target.value);
                handleInputChange(e);
              }}
              required
            />
            <button onClick={sendMessage} className="btn">
              Send
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
