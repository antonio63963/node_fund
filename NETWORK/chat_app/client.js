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
  const parsedData = JSON.parse(data.toString("utf-8"));
  if (parsedData.type == "connection") {
    myId = parsedData.id;
    await _ask();
  } else if (parsedData.type == "newConnection") {
    await terminal.clearLine(0);
    console.log(`${parsedData.user} ${parsedData.message}`);
  } else if (parsedData.type == "endConnection") {
    await terminal.clearLine(0);
    console.log(`${parsedData.user} ${parsedData.message}`);
  } else {
    if (parsedData.user == myId) {
      await terminal.moveCursor(0, -1);
    }
    await terminal.clearLine(0);
    console.log(`${parsedData.user}: ${parsedData.message}`);
    await _ask();
  }
});

client.on("close", (socket) => {
  console.log("Connection interrupted");
});
