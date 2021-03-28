// require stuff
const express = require("express"),
      app = express(),
      server = require("http").Server(app),
      io = require("socket.io")(server);

// start server listening
server.listen(3000);

// use express static
app.use(express.static("static"));

// realtime chat stuff
var msgs = [];

io.on("connection", socket => {
  socket.emit("id", socket.id);
  socket.broadcast.emit("connection", socket.id);
  socket.on("disconnect", () => {
    socket.broadcast.emit("disconnection", socket.id);
  });
  socket.emit("msgs", msgs);
  socket.on("msg", data => {
    if (data.trim()) {
      socket.broadcast.emit("msg", {id: socket.id, msg: data});
      msgs.push(socket.id + ": " + data);
    };
    if (msgs.length > 49) msgs.shift();
  });
});