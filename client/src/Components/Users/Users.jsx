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

  //events that listens on server "emits". subscribe. All "on" inside this
  // useEffect(() => {
  //   socket.on("start_chat_with_user", (username) => {
  //     //Should send to all clients
  //     socket.broadcast.emit("new_user_joined_chat", username);
  //   });
  // }, []);

  return (
    <>
      {!showLobby ? (
        <div>
          <h1>Hej och välkommen, välj ett användarnamn</h1>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Namn"
          />
          <button onClick={start_chat_with_user}>Börja chatta</button>
        </div>
      ) : (
        <ChatPage socket={socket} newUsername={newUsername} room={room} />
      )}
    </>
  );
};

export default Users;
