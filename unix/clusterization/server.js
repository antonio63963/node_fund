const cpeak = require("cpeak");

const server = new cpeak();

process.on("message", (message) => {
  console.log(`
    Process ${process.pid} received this message from parent: ${message}
    `);
});
process.send({action: 'Some response... for parent'});

server.route("get", "/", (req, res) => {
  res.status(200).json({ message: "HOHOHOH!" });
});

server.route("get", "/havy", (req, res) => {
  for (let i = 0; i < 6000000; i++) {}
  res.json({ message: "now executed..." });
});

server.listen(5050, () => {
  console.log("SERVER HAS RAN.", server.server.address());
});
