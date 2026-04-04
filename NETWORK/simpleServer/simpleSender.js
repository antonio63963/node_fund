const net = require("net");

const socket = net.createConnection({ host: "127.0.0.1", port: 3001 }, () => {
  socket.write("A simple first message...");
  socket.on('data', (data) => {
    console.log('MSG: ', data.toString());
  })
});
