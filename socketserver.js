var express = require("express");
var app = express();
var http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
var count = 1;

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("socket connected");
  socket.emit("updateCount", { count });
});

app.get("/incCount", (req, res) => {
  count++;
  io.emit("updateCount", { count });
});

app.use(express.static(__dirname + "/public"));

server.listen(3600, () => {
  console.log("server running on 3600");
});
