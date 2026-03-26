// encript decript //crypto
// hash salt // crypto
// compress // zlib
// encoding / decodiong // buffer - text-encoding-decoding

const { Transform } = require("node:stream");
const fs = require("node:fs/promises");
const { pipeline } = require("node:stream/promises");

class MyDecription extends Transform {
  _transform(chank, encoding, callBack) {
    for (let i = 0; i < chank.length; i++) {
      if (chank[i] !== 255) {
        chank[i] -= 1;
      }
    }
    console.log("TRANS DECRIPT: ", chank.toString("utf-8"));
    //this.push(chank) // или так
    // callBack(); // или ниже
    callBack(null, chank);
  }
}

(async () => {
  let readHandle;
  try {
    readHandle = await fs.open("write.txt", "r");
    // const writeHandle = await fs.open("write.txt", "w");

    const readStream = readHandle.createReadStream();
    // const writeStream = writeHandle.createWriteStream();

    const myDecryption = new MyDecription();

    // readStream.pipe(myEncrypt).pipe(writeStream);
    await pipeline(readStream, myDecryption, process.stdout);
  } catch (error) {
    console.log(error);
  } finally {
    if (readHandle) await readHandle.close();
  }
})();
