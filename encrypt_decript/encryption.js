// encript decript //crypto
// hash salt // crypto
// compress // zlib
// encoding / decodiong // buffer - text-encoding-decoding

const { Transform, pipeline } = require("node:stream");
const fs = require("node:fs/promises");

class MyEncrypt extends Transform {
  _transform(chank, encoding, callBack) {
    for(let i =0; i<chank.length; i++) {
      if(chank[i] !== 255) {
        chank[i] += 1;
      }
    }
    console.log('TRANS: ', chank.toString('utf-8'));
    //this.push(chank) // или так
    // callBack(); // или ниже
    callBack(null, chank);
  }
}

(async () => {
  const readHandle = await fs.open("read.txt", "r");
  const writeHandle = await fs.open("write.txt", "w");

  const readStream = readHandle.createReadStream();
  const writeStream = writeHandle.createWriteStream();

  const myEncrypt = new MyEncrypt();

  // readStream.pipe(myEncrypt).pipe(writeStream);
  pipeline(readStream, myEncrypt, writeStream, (err) => {
    console.log("err", err);
  });
})();
