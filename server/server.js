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

io.on("connection", (socket) => {
  socket.join("Lobby");
  io.to("Lobby").to("room1").to("room2").emit("some event");

  console.log("new client connected", socket.id);

  socket.on("start_chat_with_user", (username, room) => {
    console.log(`User with name: ${username} has joined the ${room}`);
    socket.broadcast.to("start_chat_with_user", username);
  });
    
    socket.on("start_chat_with_room", (newUsername, newRoom) => {
      console.log('hej')
      console.log(`User with name: ${username} has joined the ${room}`);
  });
})
  server.listen(3000, () => console.log("Server is up and running"));
