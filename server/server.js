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
  console.log("new client connecten", socket.id);

  io.emit("new_user", "hej hej");

  // socket.on("userName", (username) => {
  //      console.log(username);

  //     socket.broadcast.emit("new_user_joined_chat", username);

  //Nikela skriver
  //lyssnar
  // socket.on("start_chat", (username) => {
  //   console.log(username);
  //   socket.broadcast.emit("new_user_joined_chat");
  // });
});

server.listen(3000, () => console.log("Server is up and running"));
