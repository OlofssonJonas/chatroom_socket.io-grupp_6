import { useState, useEffect } from 'react'
import './App.css'
import { io } from "socket.io-client";
import { Users } from './Components/Users/Users';



function App() {

  return (
    <>
      <Users />
   </>
  )
  }

export default App
