const MyExpress = require("../../myExpress");

const server = new MyExpress();

server.route("GET", "/", (req, res) => {
  res.sendFile("../public/index.html");
});
server.route("GET", "/styles.css", (req, res) => {
  res.sendFile("../public/styles.css");
});
server.route("GET", "/main.js", (req, res) => {
  res.sendFile("../public/main.js");
});

server.listen(5555, () => {
  console.log("Server MyExpress has ran. ", server.server.address());
});
