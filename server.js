/* Copyright (C) 2017 Giancarlo Trevisan - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the MIT license.
 */
const
  express = require("express"),
  io = require("socket.io"),
  fs = require("fs");

// Parse command line
let args = process.argv.slice(2), hostname = lanIP(), port = 8080, layout = "qwerty-us";
for (let i = 0; i < args.length; ++i) {
  if (args[i] === "-h" || args[i] === "--hostname")
    hostname = args[++i];
  else if (args[i] === "-p" || args[i] === "--port")
    port = args[++i];
  else if (args[i] === "-l" || args[i] === "--layout")
    layout = args[++i];
  else {
    console.log(`Usage: node [options] server.js [-p|--port port_number] [-h|--hostname hostname][-l|--layout layout_name]`);
    return;
  }
}

let app = express();
app.use(express.static(__dirname));

let server = app.listen(port, hostname, () => console.log(`Running Programmable Visual Keyboard ${hostname}:${port}`));

io.listen(server).sockets.on("connection", socket => {
  console.log(`Requested "${layout}" on ${(new Date()).toLocaleString()}`);

//  fs.watch(`${__dirname}/keyboards/${layout}.json`, () => socket.emit("init", fs.readFileSync(`${__dirname}/keyboards/${layout}.json`).toString()));
  fs.watch(`${__dirname}/command.json`, (eventType, filename) => {
    try {
      let cmd = JSON.parse(fs.readFileSync(`${__dirname}/${filename}`).toString());
      if (cmd.type === "layout") {
        socket.emit("init", fs.readFileSync(`${__dirname}/keyboards/${cmd.layout}.json`).toString());
        layout = cmd.layout;
        console.log(`Requested "${layout}" on ${(new Date()).toLocaleString()}`);
      } else
        socket.emit(cmd.type, cmd.data);
        console.log(`Requested "${cmd.type}: ${cmd.data}" on ${(new Date()).toLocaleString()}`);
    } catch (ex) {
      console.log(ex.message);
    }
  });

  socket.emit("init", fs.readFileSync(`${__dirname}/keyboards/${layout}.json`).toString());
  socket.on("message", (data) => {
    // Write to USB HOST
    fs.writeFile('/dev/hidg0', data, err => { 
      if (err) console.log(err);
    });
  });
});

function lanIP() {
  var ifaces = require("os").networkInterfaces(), address;

  Object.keys(ifaces).forEach(ifname => {
    ifaces[ifname].forEach(iface => {
      if (typeof address !== "undefined" || iface.internal) 
        return;
      address = iface.address;
    });
  });

  return address;
}

