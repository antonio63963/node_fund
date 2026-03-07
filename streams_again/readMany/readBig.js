const fs = require("node:fs/promises");

async function myReadBig() {
  const fd = await fs.open("../writeMany/testToWrite.txt", "r");
  const fdWrite = await fs.open("./dest.txt", "w");

  const streamR = fd.createReadStream();
  const streamW = fdWrite.createWriteStream();

  streamR.on("data", (chank) => {
    if (!streamW.write(chank)) {
      streamR.pause();
    }
  });

  streamW.on("drain", () => {
    streamR.resume();
  });

  streamR.on("end", () => console.log("Finish..."));
}
//глава 11
(async () => {
  await myReadBig();
})();
