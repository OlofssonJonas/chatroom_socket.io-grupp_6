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
const usersInRooms = {};

//Event-handling for sockiet.io
io.on("connection", (socket) => {
  socket.join("Lobbyn");
  createdRoom.add("Lobbyn", Array.from(createdRoom)); //add room to set
  io.emit("roomList", Array.from(createdRoom)); // sending list of rooms to clients
  console.log("new client connected", socket.id);

  socket.on("start_chat_with_user", (room, username) => {
    console.log(`User with name: ${username} has joined the ${room}`);

    socket.join(room);
    socket.username = username;
    if (!usersInRooms[room]) {
      usersInRooms[room] = [];
    }
    if (!usersInRooms[room].includes(username)) {
      usersInRooms[room].push(username);
    }
    io.to(room).emit("userList", usersInRooms[room]);

    //Counting clients in room
    const clientsInRoom = io.sockets.adapter.rooms.get("Lobbyn");
    const numberOfClients = clientsInRoom ? clientsInRoom.size : 0;
    io.to("Lobbyn").emit("clientsInRoom", numberOfClients);
    console.log("Connection with user", io.sockets.adapter.rooms);
  });

  socket.on("disconnect", () => {
    if (socket.room && usersInRooms[socket.room]) {
      usersInRooms[socket.room] = usersInRooms[socket.room].filter(
        (username) => username !== socket.username
      );
      io.to(socket.room).emit("userList", usersInRooms[socket.room]);

      if (usersInRooms[socket.room].length === 0) {
        delete usersInRooms[socket.room];
        io.emit("roomList", Object.keys(usersInRooms));
      }
      const clientsInRoom = io.sockets.adapter.rooms.get(socket.room);
      const numberOfClients = clientsInRoom ? clientsInRoom.size : 0;
      io.to(socket.room).emit("clientsInRoom", numberOfClients);
    }

    console.log("disconnected", io.sockets.adapter.rooms);
  });

  socket.on("changeRoom", (roomName) => {
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
        if (currentRoom !== "Lobbyn" && usersInRooms[currentRoom]) {
          if (usersInRooms[currentRoom].length === 0) {
            delete usersInRooms[currentRoom];
            io.emit("roomList", Object.keys(usersInRooms));
          }
        }
      }
    });
    if (!usersInRooms[roomName]) {
      usersInRooms[roomName] = [];
    }
    if (!usersInRooms[roomName].includes(socket.username)) {
      usersInRooms[roomName].push(socket.username);
    }
    if (!createdRoom.has(roomName)) {
      createdRoom.add(roomName);
      io.emit("roomList", Array.from(createdRoom));
    }
    socket.join(roomName);
    io.to(roomName).emit("userList", usersInRooms[roomName]); // Notify all users in the room about the updated user list
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
