import React from 'react'
import "./ChatPage.css"

export const ChatPage = () => {
  return (
    <>
    <header>
    <p>Byt Rum</p>
    
    <div className='dropdown'>
    <select>
    <option value="" disabled selected>Dropdown</option>
              <option value="rum1">Rum 1</option>
              <option value="rum2">Rum 2</option>
              <option value="rum3">Rum 3</option>
            </select>

    </div>
    

    
    </header>
    {/* <h1>Välkommen till rummet</h1> */}
    <h1>Chatt</h1>

    </>
  )
}
export default ChatPage