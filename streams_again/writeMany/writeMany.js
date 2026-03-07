const fsAsync = require("node:fs/promises");
const fs = require("node:fs");

// 17-19sec 50mb
async function writeManyAsync() {
  try {
    console.time("testS");
    const fd = await fsAsync.open("testToWrite.txt", "w");
    for (let i = 0; i < 1000000; i++) {
      await fd.write(i.toString());
    }
    console.timeEnd("testS");
  } catch (err) {
    console.log(err);
  }
}

// 1-2sec
function writeManySync() {
  try {
    console.time("testS");
    fs.open("testToWrite.txt", "w", (err, fd) => {
      for (let i = 0; i < 1000000; i++) {
        // с созданием буффера немного дольше
        // const buf = Buffer.from(i.toString(), "utf8");
        // await fd.write(buf);
        fs.writeSync(fd, `${i}`);
      }
      fs.close(fd);
    });
    console.timeEnd("testS");
  } catch (err) {
    console.log("err: ", err);
  }
}

// 0.4sec NOT DO IT!!! memory 150mb
async function writeManyStream() {
  try {
    console.time("stream start");
    const fd = await fsAsync.open("testToWrite.txt", "w");
    const stream = fd.createWriteStream();

    for (let i = 0; i < 1000000; i++) {
      const buff = Buffer.from(` ${i} `, "utf8");
      stream.write(buff);
    }
    fd.close(); //закрывает раньше чем запишет
    console.timeEnd("stream start");
  } catch (err) {
    console.log(err);
  }
}

//50mb 0.4s
async function writeManyStreamDrain() {
  try {
    console.time("stream start");
    const fd = await fsAsync.open("testToWrite.txt", "w");
    const stream = fd.createWriteStream();

    console.log("Buffer volume: ", stream.writableHighWaterMark); // объем буфера
    console.log("Buffer size occupied: ", stream.writableLength); // занятый объем буфера

    const buff = Buffer.from("thei", "utf-8");
    stream.write(buff);
    console.log("Buffer volume: ", stream.writableHighWaterMark); // объем буфера
    console.log("Buffer size occupied: ", stream.writableLength);

    let i = 0;
    function _writeMany() {
      while (i < 1000000) {
        const buff = Buffer.from(` ${i} `, "utf8");
        if (!stream.write(buff)) {
          break;
        }
        if (i === 999999) {
          stream.end(buff);
        }
        i++;
      }
    }
    _writeMany();
    stream.on("drain", () => {
      _writeMany();
    });

    stream.on("finish", () => {
      fd.close();
      console.timeEnd("stream start");
    });
  } catch (err) {
    console.log(err);
  }
}

(function run() {
  writeManyStreamDrain();
})();
