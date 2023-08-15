import { useEffect} from 'react'
import { io } from "socket.io-client";
import './Users.css'

export const Users = () => {
  //Calling server
  const socket = io("http://localhost:3000/", { autoConnect: false });

const start_chat_with_user = () => {
  socket.connect();
}

  useEffect(() => {
    socket.on("new_user", (username) => {
      console.log(username);
    });
  }, []);

  return (
    <>
      <input type="text" placeholder="Namn"></input>
      <button onClick={start_chat_with_user}>Börja chatta</button>
    </>
  );
};

export default Users