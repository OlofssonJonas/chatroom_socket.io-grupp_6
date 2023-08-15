import { useState, useEffect } from 'react'
import './App.css'
import { io } from "socket.io-client";
import { Users } from './Components/Users/Users';
import HomePage from './Components/HomePage/HomePage';


function App() {

  return (
    <>
      <HomePage />
      <Users />
   </>
  )
  }

export default App
