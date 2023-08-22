const express = require("express");

const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());

// Set to keep track of created rooms
const createdRoom = new Set();
const rooms = {};
console.log(io.sockets.adapter.rooms);

//Event-handling for sockiet.io
io.on("connection", (socket) => {
  socket.join("Lobbyn");
  createdRoom.add("Lobbyn", Array.from(createdRoom)); //add room to set
  io.emit("roomList", Array.from(createdRoom)); // sending list of rooms to clients
  console.log("new client connected", socket.id);

  socket.on("start_chat_with_user", (username, room) => {
    console.log(`User with name: ${username} has joined the ${room}`);
    socket.broadcast.to("start_chat_with_user", username);
    //Counting clients in room
    const clientsInRoom = io.sockets.adapter.rooms.get("Lobbyn");
    const numberOfClients = clientsInRoom ? clientsInRoom.size : 0;
    io.to("Lobbyn").emit("clientsInRoom", numberOfClients);
    console.log(io.sockets.adapter.rooms);
  });

  socket.on("disconnect", () => {
    const clientsInRoom = io.sockets.adapter.rooms.get("Lobbyn");
    const numberOfClients = clientsInRoom ? clientsInRoom.size : 0;
    io.to("Lobbyn").emit("clientsInRoom", numberOfClients);
  });

  socket.on("changeRoom", (roomName) => {
    socket.leave(roomName);
    console.log(`${socket.id} has left the room ${roomName}`);
    if (rooms[roomName]) {
      rooms[roomName] = rooms[roomName].filter((id) => id !== socket.id);
      if (rooms[roomName].length === 0 && rooms[roomName] !== "Lobby") {
        delete rooms[roomName];
      }
    }
    console.log(io.sockets.adapter.rooms);
  });

  socket.on("start_chat_with_room", (room) => {
    createdRoom.add(room);
    io.emit("roomList", Array.from(createdRoom));
    socket.join(room);
    if (!rooms[room]) {
      rooms[room] = [socket.id];
    } else {
      rooms[room].push(socket.id);
    }
  });

  socket.on("send_message", (data) => {
    io.to(data.room).emit("receive_message", data);
    console.log(data);
  });

  //den ska vara kvar Nikela

  // socket.on('disconnet', () => {
  //   console.log('A user has disconncted')
  // })

  // Ammar

  socket.on("typing", () => {
    socket.broadcast.emit("userTyping", { userId: socket.id });
    // console.log("is typing");
  });
  socket.on("stopTyping", () => {
    socket.broadcast.emit("userStoppedTyping", { userId: socket.id });
    console.log("not typing");
  });
  // socket.on("typing", () => {
  //   socket
  //     .to(roomName)
  //     .emit("userTyping", { userId: socket.id, room: currentRoom });
  //   console.log("is typing");
  // });

  // socket.on("stopTyping", () => {
  //   socket
  //     .to(roomName)
  //     .emit("userStoppedTyping", { userId: socket.id, room: roomName });
  //   console.log("not typing");
  // });
});
server.listen(3000, () => console.log("Server is up and running"));
