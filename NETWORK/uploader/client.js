const net = require("node:net");
const fs = require("node:fs/promises");

const client = net.createConnection({ port: 5050, host: "::1" }, async () => {
  const fd = await fs.open("clientFile.txt", "r");
  const readStream = fd.createReadStream();

  readStream.on("data", (chunk) => {
    console.log("STREAM: ", chunk.toString());
    if (!client.write(chunk)) {
      client.pause();
    }
  });

  readStream.on("drain", () => {
    readStream.resume();
  });

  readStream.on("end", () => {
    fd.close();
    readStream.close();
    client.end();
  });
});

client.on("data", (data) => {});
