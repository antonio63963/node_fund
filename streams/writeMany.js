const fs = require("node:fs/promises");
// const fs = require("node:fs");

// async function createFile() {
//   try {
//     console.time('write many')
//     const fd = await fs.open("forWriting.txt", "w");
//     for (let i = 0; i < 1000000; i++) {
//      await fd.writeFile(` ${i} `, { append: true });
//     }
//     fd.close();
//     console.timeEnd('write many');
//   } catch (err) {
//     console.log(err);
//   }
// }

// async function createWithCall() {
//   console.time("write many");
//   fs.open("forWriting2.txt", "w", (err, fd) => {
//     for (let i = 0; i < 1000000; i++) {
//       fs.writeSync(fd, ` ${i} `);
//     }
//   console.timeEnd("write many");
//   });
// }
//
// async function streamWriting() {
//   console.time("Write stream");
//   const fd = await fs.open("bad-bad_stream.txt", "w");

//   const readStr = fd.createReadStream().write();

//   for (let i = 0; i < 1000000; i++) {
//     const buff = Buffer.from(` ${i} `, "utf-8");
//     stream.write(buff);
//     if (i == 999999) {
//       console.log(i);
//   }
//   }
//   console.timeEnd("Write stream");
// }

async function goodStream() {
  console.time("write many");
  const fd = await fs.open("goodStream.txt", "a");
  const stream = fd.createWriteStream();
  console.log(stream.writableHighWaterMark);
  console.log(stream.writableLength);

  let i = 0;
  i = writeMany(stream, i);

  stream.on("drain", () => {
    console.log("DRAIN...", stream.writableLength, " i: ", i);
    i = writeMany(stream, i);
  });
  stream.on("finish", async () => {
    await fd.close();
    console.timeEnd("write many");
  });
}

function writeMany(stream, i) {
  while (i < 1000000) {
    const buff = Buffer.from(` ${i} `, "utf-8");

    const canIpush = stream.write(buff);
    if (!canIpush) {
      if (i == 999999) {
        stream.end(buff);
      }
      return i;
      break;
    }
    i++;
  }
}
(async function run() {
  // await createFile();
  // createWithCall();
  // streamWriting();
  goodStream();
})();
