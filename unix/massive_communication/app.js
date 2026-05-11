const { spawn } = require("node:child_process");
const fs = require("node:fs/promises");
const { pipeline } = require("node:stream");

const numberFormatter = spawn("number_formatter", ["$", "."]);

numberFormatter.stdout.on("data", (data) => {
  console.log("Data: ", data.toString());
});
numberFormatter.stderr.on("data", (err) => {
  console.log("ERROR: ", err.toString());
});

numberFormatter.on("close", (code) => {
  if (code === 0) {
    console.log("===OK====");
  } else {
    console.log("===BAD===");
  }

  
})(async function run() {
  let fd;
  let readStream;

  try {
    fd = await fs.open("./data/numbers.txt", "r");
    readStream = fd.createReadStream();
    await pipeline(readStream, numberFormatter.stdin, (err) => {
      if (err) {
        console.error(err);
      }
    });
  } catch (error) {
    console.error(error);
  } finally {
    if (fd != null) {
      fd.close();
      read;
    }
  }
})();
