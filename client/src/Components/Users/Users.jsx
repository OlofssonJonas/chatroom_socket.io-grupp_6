import { useEffect, useState} from 'react'
import { io } from "socket.io-client";
import './Users.css'
import Lobby from '../Lobby/Lobby';

export const Users = () => {
  const [username, setUsername] = useState('')

  

  //Calling server
  const socket = io("http://localhost:3000/", { autoConnect: false });

const start_chat_with_user = () => {
  socket.connect()
  console.log(username)
  // if(username.trim() !== '') {
  // console.log("Startar chatt med användare", username);
   
  // }else {
  //   console.log("Användarnamnet är inte tillåtet")
  // }
  
}

  // useEffect(() => {
  //   socket.on("new_user", (username) => {
  //     console.log(username);
  //   });
  // }, []);



  return (
    <>
      <input type="text" placeholder="Namn" onChange={(e) => {setUsername(e.target.value)}}></input>
      <button onClick={start_chat_with_user}>Börja chatta</button>
   
      <Lobby socket={socket} username={username}/>
    
    </>
  );
};

export default Users