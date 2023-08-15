import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./Users.css";
import { Lobby } from "../Lobby/Lobby";

export const Users = () => {
  //Calling server
  const socket = io("http://localhost:3000/", { autoConnect: false });
  const [newUsername, setNewUsername] = useState("");
  const [showLobby, setShowLobby] = useState(false);

  const start_chat_with_user = () => {
    socket.connect();
    console.log("Starting chat with user:", newUsername);
    checkUserInput();
  };

  const checkUserInput = () => {
    if (newUsername != "") {
      setShowLobby(true);
    }
  };

  //sending username to server(terminal).
  socket.emit("start_chat_with_user", newUsername);

  //events that listens on server "emits". subscribe. All "on" inside this
  useEffect(() => {
    socket.on("start_chat_with_user", (username) => {
      //Should send to all clients
      socket.broadcast.emit("new_user_joined_chat", username);
    });
  }, []);

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
        <Lobby />
      )}
    </>
  );
};

export default Users;
