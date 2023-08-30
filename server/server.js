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
let connectedUsers = {};
//Event-handling for sockiet.io
io.on("connection", (socket) => {
  socket.join("Lobbyn");
  createdRoom.add("Lobbyn", Array.from(createdRoom)); //add room to set
  io.emit("roomList", Array.from(createdRoom)); // sending list of rooms to clients
  console.log("new client connected", socket.id);

  socket.on("start_chat_with_user", (username, room) => {
    console.log(`User with name: ${username} has joined the ${room}`);
    // Lägg till användaren och rummet i din lista
    connectedUsers[socket.id] = { username, room };
    io.emit("userList", Object.values(connectedUsers));
    //Counting clients in room
    const clientsInRoom = io.sockets.adapter.rooms.get("Lobbyn");
    const numberOfClients = clientsInRoom ? clientsInRoom.size : 0;
    io.to("Lobbyn").emit("clientsInRoom", numberOfClients);
    console.log("Connection with user", io.sockets.adapter.rooms);
  });

  socket.on("disconnect", () => {
    delete socket.room;

    // Ta bort användaren från listan vid frånkoppling
    delete connectedUsers[socket.id];
    io.emit("userList", Object.values(connectedUsers));

    const clientsInRoom = io.sockets.adapter.rooms.get("Lobbyn");
    const numberOfClients = clientsInRoom ? clientsInRoom.size : 0;
    io.to("Lobbyn").emit("clientsInRoom", numberOfClients);
    console.log("disconnected", io.sockets.adapter.rooms);
  });

  socket.on("changeRoom", (roomName) => {
    if (connectedUsers[socket.id]) {
      connectedUsers[socket.id].currentRoom = roomName;
      io.emit("userList", Object.values(connectedUsers));
    }
    socket.leave(roomName);
    if (roomName !== "Lobbyn") {
      const roomClients = io.sockets.adapter.rooms.get(roomName);
      if (!roomClients || roomClients.size === 0) {
        createdRoom.delete(roomName);
        io.emit("roomList", Array.from(createdRoom));
      }
    }
  });

  socket.on("start_chat_with_room", (roomName) => {
    const currentRooms = Array.from(socket.rooms);

    currentRooms.forEach((currentRoom) => {
      if (currentRoom !== socket.id) {
        socket.leave(currentRoom);
        if (currentRoom !== "Lobbyn") {
          const roomClients = io.sockets.adapter.rooms.get(currentRoom);

          if (!roomClients || roomClients.size === 0) {
            createdRoom.delete(currentRoom); // Ta bort tomma rum från createdRoom
            io.emit("roomList", Array.from(createdRoom));
            console.log(currentRoom, "nejnej");
          }
        }
      }
    });

    if (!createdRoom.has(roomName)) {
      createdRoom.add(roomName);
      io.emit("roomList", Array.from(createdRoom));
    }

    socket.join(roomName);

    console.log("Rum som är kvar:", io.sockets.adapter.rooms);
  });

  socket.on("send_message", (data) => {
    io.to(data.room).emit("receive_message", data);
  });

  socket.on("typing", (data) => {
    socket.to(data.room).emit("userTyping", { userId: socket.id });
  });
});
server.listen(3000, () => console.log("Server is up and running"));
