const net = require("node:net");

const port = 3008;
const host = "127.0.0.1";

const server = net.createServer();

const clients = [];

server.on("connection", (socket) => {
  console.log("NEW CONNECTION: ", socket.address());

  const clientId = (clients.length + 1).toString();
  socket.write(JSON.stringify({type: 'connection', id: clientId}));

  socket.on('data', (data) => {
    console.log(data.toString('utf-8'), typeof data);
    clients.map(c => c.socket.write(data.toString()));
  })

  clients.push({id: clientId, socket});
});

server.listen(port, host, () => {
  console.log("Server running on ", server.address());
});
