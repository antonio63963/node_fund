const net = require("node:net");
const MyTeminal = require("./my_terminal");
// const readline = require("node:readline/promises");

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// async function _ask() {
//   const message = await rl.question("Create a message> ");
//   client.write(message);
// }

const terminal = new MyTeminal();

let myId;

const client = net.createConnection(
  { port: 3008, host: "127.0.0.1" },
  async () => {
    await _ask();
  }
);

console.log("CLIETN: ", client.address());

async function _ask() {
  const message = await terminal.ask();
  client.write(JSON.stringify({ type: "message", user: myId, message }));
}

client.on("data", async (data) => {
  console.log("DATA: ", data.toString());
  const parsedData = JSON.parse(data.toString("utf-8"));
  console.log(parsedData);
  if (parsedData.type == "connection") {
    console.log("id: ", parsedData.id);

    myId = parsedData.id;
    await _ask();
  } else {
    console.log("Message: ", parsedData);
    await terminal.moveCursor(0, -1);
    await terminal.clearLine(0);
    console.log("Message: ", parsedData);
    await _ask();
  }
});

client.on("close", (socket) => {
  console.log("Connection interrupted");
});
