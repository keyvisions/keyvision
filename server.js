// Server side code
const
  express = require("express"),
  io = require("socket.io"),
  fs = require("fs");

var app = express();
app.use(express.static(__dirname));

var server = app.listen(8080, () => console.log("Programmable Visual Keyboard on http://localhost:8080/"));

io.listen(server).sockets.on("connection", socket => {
  console.log("Connection " + new Date());

  let layout = __dirname + "/keyboards/qwerty-it.json";
  fs.watch(layout, () => socket.emit("init", fs.readFileSync(layout).toString()));

  socket.emit("init", fs.readFileSync(layout).toString());
  socket.on("message", data => {
    // TODO: Send to USB
    console.log(data);
  });
});
