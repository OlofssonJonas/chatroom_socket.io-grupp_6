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
  console.log("new client connected", socket.id);

  
  socket.on("start_chat_with_user", (username) => {
    console.log(username);
    socket.broadcast.emit("start_chat_with_user", username);
  });
});

server.listen(3000, () => console.log("Server is up and running"));
