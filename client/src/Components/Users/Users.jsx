import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./Users.css";

export const Users = () => {
  //Calling server
  const socket = io("http://localhost:3000/", { autoConnect: false });
  const [newUsername, setNewUsername] = useState("");

  const start_chat_with_user = () => {
    socket.connect();
    console.log("Starting chat with user:", newUsername);
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
      <input
        type="text"
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
        placeholder="Namn"
      />
      <button onClick={start_chat_with_user}>Börja chatta</button>
    </>
  );
};

export default Users;
