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
    delete socket.rooms;
    const clientsInRoom = io.sockets.adapter.rooms.get("Lobbyn");
    const numberOfClients = clientsInRoom ? clientsInRoom.size : 0;
    io.to("Lobbyn").emit("clientsInRoom", numberOfClients);
  });

  socket.on("changeRoom", (roomName) => {
    socket.leave(roomName);
    if (rooms[roomName]) {
      rooms[roomName] = rooms[roomName].filter((id) => id !== socket.id);
      if (rooms[roomName].length === 0 && rooms[roomName] !== "Lobby") {
        delete rooms[roomName];
        //nikela adds
        createdRoom.delete(roomName);
      }
      io.emit("roomList", Array.from(createdRoom));
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
  });

  socket.on("typing", (data) => {
    socket.to(data.room).emit("userTyping", { userId: socket.id });
  });
  socket.on("stopTyping", (room) => {
    socket.to(room).emit("userStoppedTyping", { userId: socket.id });
    console.log("not typing");
  });
});
server.listen(3000, () => console.log("Server is up and running"));
