const net = require("net"); // самый низкий уровень сетевого взаимодействия в node
const port = 3001;

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    console.log(data.toString());
  });
  socket.write('Ok, I got your message!');
});

server.listen(port, "127.0.0.1", (err) => {
  console.log(err);
  console.log("SERVER HAS RAN ON PORT ", server.address());
});
