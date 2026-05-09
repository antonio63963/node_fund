const { stdin, stdout, stderr, argv, exit } = require("node:process");
const fs = require("node:fs");
const { pipeline } = require("node:stream");

//bash: node cat.js filePath
const filePath = argv[2];
console.log("PATH FILE: ", filePath);

if (filePath) {
  const fileStream = fs.createReadStream(filePath);
  pipeline(fileStream, stdout, (err) => {
    if (err) {
      console.error("ERROR: ", err);
    }
    exit(0);
  });

}

stdin.on("data", (data) => {
  // const upp = data.toString("utf-8").toUpperCase();
  // stdout.write(upp);
  console.log("DATA: ", data.toString("utf-8").toUpperCase());
});
