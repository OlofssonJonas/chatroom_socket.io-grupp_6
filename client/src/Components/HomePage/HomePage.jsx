import { useEffect} from 'react'
import { io } from "socket.io-client";
import './HomePage.css'

const HomePage = () => {

//Calling server
  const socket = io("http://localhost:3000/", { autoConnect: false });
  
  useEffect(() => {
    socket.on('new_user', (username) => {
      console.log(username)
    })
  }, [])


  // //Nikela skriver
     const startChat = () => {
         socket.connect();
       }

  //     //nikela slutar skriva
  return (
    <>
    <h1>Hej och välkommen, välj ett användarnamn</h1>
    <input type='text' placeholder='Namn'></input>
    <button onClick={startChat}>Börja chatta</button>
    </>
  )
}

 export default HomePage