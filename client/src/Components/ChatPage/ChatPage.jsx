import React, { useState } from "react";
import "./ChatPage.css";

const ChatPage = ({ socket, username }) => {
  //nya rum
  const [newRoomName, setNewRoomName] = useState("");
  //kolla om rumet är skapad
  const [roomCreated, setRoomCreated] = useState(false);

  //befitliga rum
  const [rooms, setRooms] = useState(["rum 1", "rum 2", "rum 3"]);

  const createRoom = () => {
    if (newRoomName.trim() != "") {
      setNewRoomName("");
      //för att lägga till rum i befintliga rum
      const updatedRooms = [...rooms, newRoomName];
      setRooms(updatedRooms); //ska sätta nya rummet i listan
      setRoomCreated(true);
      // socket.connect();
      console.log("Skapar rum med namnet", newRoomName);
    } else {
      alert("rum namet får inte vara tomt.");
    }
  };

  return (
    <>
      {/* detta ska göra att allt försvinner och endast chatpage kommer upp */}
      {roomCreated ? (
        <ChatPage />
      ) : (
        <div className="div1">
          <h1> Välkommen till chatpage </h1>
          <h2 htmlFor="rum">Välj rum eller skapa ett rum</h2>

          <select name="hej" id="">
            {/* att mappa hjälper oss att skapa en ny rum för varje rum som skapas */}
            {rooms.map((room, index) => (
              <option key={index} value={room}>
                {room}
              </option>
            ))}
          </select>

          <label htmlFor="">skapa rum</label>
          <input
            type="text"
            placeholder="Namn på nya rummet"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
          />
          <button onClick={createRoom}> Skapa rum </button>
        </div>
      )}
    </>
  );
};

export default ChatPage;
