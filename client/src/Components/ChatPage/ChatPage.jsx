import React, { useEffect, useState, useRef } from "react";
import "./ChatPage.css";
import { useSocket } from "../../Context/ContextForSocket";
import Users from "../Users/Users";
import ScrollToBottom from "react-scroll-to-bottom";
import axios from "axios";

const ChatPage = ({ newUsername, room }) => {
  const socket = useSocket(); //using socket from context!

  const [newRoom, setNewroom] = useState("");
  const [roomList, setRoomlist] = useState(["Lobbyn"]);
  const [currentRoom, setCurrentRoom] = useState("Lobbyn");
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [leaveChat, setLeaveChat] = useState(false);
  const [clientCount, setClientCount] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIstyping] = useState(false);
  const [randomGifUrl, setRandomGifUrl] = useState("");
  const inputRef = useRef(null);

  const [userList, setUserList] = useState([]);
  useEffect(() => {
    setCurrentRoom(room);
  }, [room]);

  const fetchUserList = () => {
    socket.emit("get_user_list");
  };

  const fetchRandomGif = async () => {
    try {
      const endpoint = `https://api.giphy.com/v1/gifs/random?api_key=${
        import.meta.env.VITE_API_KEY
      }`;

      const response = await axios.get(endpoint);
      if (response.status === 200) {
        const gifUrl = response.data.data.images.original.url;
        return gifUrl;
      }
    } catch (error) {
      console.error("Error fetching random GIF:", error);
    }
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" || !e.key) {
      if(currentMessage.trim('')) {
        let url;
        if (currentMessage === "/gif") {
          url = await fetchRandomGif();
          setCurrentMessage("");
          inputRef.current.focus();
      }

        
        const messageData = {
          room: currentRoom,
          author: newUsername,
          msg: currentMessage,
          url: url,
          time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
        };
        await socket.emit("send_message", messageData);
        setCurrentMessage("");
        inputRef.current.focus();
    }
    }
    };

  const checkRoomInput = (e) => {
    if (e.key === "Enter" || !e.key) {
      if (newRoom.trim() != "") {
        if (newRoom === currentRoom) {
          alert("Du har redan skapat rummet!");
        } else {
          socket.emit("start_chat_with_room", newRoom);
          setCurrentRoom(newRoom);
          setSelectedRoom(newRoom);
          changeRoom();
          setMessageList([]);
          setNewroom("");
          setNewroom("");
          inputRef.current.focus();
        }
      } else {
        alert("Fältet får inte vara tomt.");
      }
      setCurrentMessage("");
    }
  };

  const LeaveChat = () => {
    setLeaveChat(true); //updating state
    changeRoom();
    socket.disconnect();
  };

  const changeRoom = () => {
    socket.emit("changeRoom", currentRoom);
    setMessageList([]);
  };

  const joinSelectedRoom = () => {
    if (selectedRoom.trim() != "") {
      if (selectedRoom === currentRoom) {
        alert("Du är redan i detta rum!");
      } else {
        socket.emit("start_chat_with_room", selectedRoom);
        setCurrentRoom(selectedRoom);
        changeRoom();
      }
    }
  };

  useEffect(() => {
    socket.on("roomList", (rooms) => {
      setRoomlist(rooms);
    });

    socket.on("userList", (users) => {
      setUserList(users);
    });
    fetchUserList();

    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });

    socket.on("clientsInRoom", (qtyOfClients) => {
      setClientCount(qtyOfClients);
    });
  }, [socket]);

  const handleInputChange = (event) => {
    if (event.target.value !== "") {
      socket.emit("typing", { room: currentRoom, userId: newUsername });
    }
  };

  useEffect(() => {
    let typingTimeout;
    socket.on("userTyping", (data) => {
      if (!typingUsers.includes(data.userId)) {
        setTypingUsers((prevUsers) => [...prevUsers, data.userId]);
        setIstyping(true);
      }
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        setIstyping(false);
      }, 4000);
    });

    socket.on("userStoppedTyping", (data) => {
      setTypingUsers((prevUsers) =>
        prevUsers.filter((user) => user !== data.userId)
      );
      setIstyping(false);
    });
  }, [socket, isTyping, clearTimeout]);

  useEffect(() => {
    const handleUnload = () => {
      socket.emit("changeRoom", currentRoom);
    };
    window.addEventListener("beforeunload", handleUnload);
  }, [socket, currentRoom]);

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
              <h5>Users & Room</h5>
            <hr className="users_room"></hr>
              <select className="counter">
                {userList.map((user, idx) => (
                  <option key={idx}>
                    {user.username} - {user.room}
                  </option>
                ))}
              </select>
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
              <button className="smallBtn" onClick={joinSelectedRoom}>
                Change room
              </button>
              <br></br>
              <div id="room-name">
                <input
                  type="text"
                  onKeyDown={checkRoomInput}
                  ref={inputRef}
                  value={newRoom}
                  placeholder="new room"
                  onChange={(e) => setNewroom(e.target.value)}
                />
                <button className="smallBtn" onClick={checkRoomInput}>
                  Create new room
                </button>
              </div>
            </div>
            <div className="chat-messages">
              <ScrollToBottom className="chat-scroll">
                {messageList.map((messageContent, idx) => (
                  <div
                    key={idx}
                    id={newUsername === messageContent.author ? "you" : "other"}
                  >
                    <div className="msgText">
                      {messageContent.time} {messageContent.author}{" "}
                    </div>
                    <div className="msgBubble">
                      {!messageContent.url ? messageContent.msg : null}
                        {messageContent.url && (
                          <img cla src={messageContent.url} alt="Random Gif" />
                        )}
                    </div>
                  </div>
                ))}
              </ScrollToBottom>
              <div className="inputAndBtn">
                <div className="isTyping">
                  {isTyping && <p> Someone is typing...</p>}
                  <p className="usersInRoom">{clientCount} online </p>
                </div>
                <div>
                  <input
                    id="msg"
                    type="text"
                    ref={inputRef}
                    onKeyDown={sendMessage}
                    value={currentMessage}
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
                </div>
              </div>
            </div>
          </main>
        </div>
      ) : (
        <Users />
      )}
    </>
  );
};
export default ChatPage;
