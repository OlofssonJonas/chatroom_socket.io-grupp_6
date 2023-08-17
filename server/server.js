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

const createdRoom = new Set()

io.on("connection", (socket) => {
  socket.join();
  createdRoom.add('Lobbyn', Array.from(createdRoom))
  io.emit('roomList', Array.from(createdRoom))
  //io.to("Lobby").to("room1").to("room2").emit("some event");

  console.log("new client connected", socket.id);

  socket.on("start_chat_with_user", (username, room) => {
    console.log(`User with name: ${username} has joined the ${room}`);
    socket.broadcast.to("start_chat_with_user", username);
  });

  socket.on('start_chat_with_room', room => {
    socket.join(room)
    createdRoom.add(room)
    io.emit('roomList', Array.from(createdRoom))
    console.log(`${socket.id} has joined ${room}`)
  })
    
  //   socket.on("start_chat_with_room", (username, room) => {
  //     console.log('hej')
  //     console.log(`User with name: ${username} has joined the ${room}`);
  // });

  // socket.on('disconnet', () => {
  //   console.log('A user has disconncted')
  // })
})
  server.listen(3000, () => console.log("Server is up and running"));
