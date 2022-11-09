const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());
const mongoose = require("mongoose");
const Message = require("./models/Message");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});



mongoose
  .connect( "mongodb://localhost:27017/Message")
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });


io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);


  socket.on("join_room", (data) => {
    socket.join(data);
    Message.find({room:data} , {_id:0}).then(result => {
      console.log(result , "result")
      socket.emit('receive_message', result)
  })
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });


  socket.on("send_message", (data) => {
    console.log(data, "data");
    const message = new Message(data);
    message.save().then(() => {
      socket.to(data.room).emit("receive_message", data);
    });
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
