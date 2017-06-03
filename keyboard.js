// Server side code
const
  express = require("express"),
  io = require("socket.io"),
  fs = require("fs");

var app = express();

app.use(express.static(__dirname));

var server = app.listen(8080, () => console.log("Listening on http://localhost:8080/"));

io.listen(server).sockets.on("connection", socket => {
  var layout = fs.readFileSync(__dirname + "/keyboards/custom.json").toString();

  socket.emit("init", layout);
  socket.on("message", data => {
    // Send to USB
    console.log(JSON.stringify(data));
  });
});
