import { useState } from "react";
import "./Users.css";
import ChatPage from "../ChatPage/ChatPage";
import { useSocket } from "../../Context/ContextForSocket";

export const Users = () => {
  const [showLobby, setShowLobby] = useState(false);
  const room = 'Lobby' 

  const socket = useSocket() //using socket from context!
  const [newUsername, setNewUsername] = useState("");

  const start_chat_with_user = () => {
    socket.connect();
    console.log("Starting chat with user:", newUsername);
    checkUserInput();
  };

  const checkUserInput = () => {
    if (newUsername.trim() != "") {
      setShowLobby(true);

      //sending username to server(terminal).
      socket.emit("start_chat_with_user", newUsername, room);
    } else {
      alert("Användarnamn får inte vara tomt.");
    }
  };
  
  return (
    <>
    {!showLobby ? (
		<div className="join-container">
			<header className="join-header">
				<h1><i className="fas fa-smile">Hej och välkommen, välj ett användarnamn</i>d</h1>
			</header>
			<main className="join-main">
				<form>
					<div className="form-control">
						<input
							type="text"
              onChange={(e) => setNewUsername(e.target.value)}
							placeholder="Enter username..."
						/>
					</div>
					<button className="btn" onClick={start_chat_with_user}>Börja chatta</button>
				</form>
			</main>
		</div>
        ) : (
          
          <ChatPage newUsername={newUsername} room={room} />
          )}
          </>
  );
};

export default Users;
