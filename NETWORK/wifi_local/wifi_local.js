const http = require('node:http');

const port = 4444;
const hostname = '192.168.10.108';

const server = http.createServer((req, res) => {
  console.log('HOHOHO');
  const sendData = {message: 'Hi there!'};

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Connection", "close");
  res.statusCode = 200;
  res.end(JSON.stringify(sendData));
});

server.listen(port, hostname, () => {
  console.log(`Server has ran ${hostname}:${port}`);
});