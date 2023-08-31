import { useEffect, useState } from "react";
import "./Users.css";
import ChatPage from "../ChatPage/ChatPage";
import { useSocket } from "../../Context/ContextForSocket";

export const Users = () => {
  const [showLobby, setShowLobby] = useState(false);
  const socket = useSocket(); //using socket from context!

  const [newUsername, setNewUsername] = useState("");
  const [currentRoom, setCurrentRoom] = useState("");

  useEffect(() => {
    if (currentRoom === "Lobbyn") {
      socket.emit("start_chat_with_user", newUsername, currentRoom);
    }
  }, [currentRoom, newUsername, socket]);

  const start_chat_with_user = (e) => {
    if (e.key === "Enter" || !e.key) {
      socket.connect();
      checkUserInput();
    }
  };

  const checkUserInput = () => {
    if (newUsername.trim() != "") {
      setShowLobby(true);
      setCurrentRoom("Lobbyn");
    } else {
      alert("Användarnamn får inte vara tomt.");
    }
  };

  const handleCreateRoom = (roomName) => {
    setCurrentRoom(roomName); // Uppdatera currentRoom när du skapar ett nytt rum
    socket.emit("start_chat_with_room", roomName);
    setShowLobby(false); // Gå till ChatPage efter att rummet skapats
  };

  return (
    <>
      {!showLobby ? (
        <div className="join-container">
          <header className="join-header"></header>
          <main className="join-main">
            <h1 className="titleStartPage">START CHAT</h1>
            <div>
              <div className="form-control">
                <input
                  type="text"
                  onKeyDown={start_chat_with_user}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="A cool alias here..."
                />
              </div>
              <button className="btn" onClick={start_chat_with_user}>
                Let the chat begin!
              </button>
            </div>
          </main>
        </div>
      ) : (
        <ChatPage
          newUsername={newUsername}
          // room={room}
          room={currentRoom}
          // currentRoom={currentRoom}
          onCreateRoom={handleCreateRoom}
        />
      )}
    </>
  );
};
export default Users;
