// "use strict";
const { Duplex } = require("node:stream");
const fs = require("node:fs");

class DuplexStream extends Duplex {
  constructor({
    readableHighWatermark,
    writableHighWatermark,
    readFilePath,
    writeFilePath,
  }) {
    super({
      readableHighWaterMark: readableHighWatermark,
      writableHighWaterMark: writableHighWatermark,
    });
    this.readableHighWatermark = readableHighWatermark;
    this.writableHigWatermark = writableHighWatermark;
    this.readFilePath = readFilePath;
    this.writeFilePath = writeFilePath;
    this.chunks = [];
    this.chunksSize = 0;
    this.readFd = null;
    this.writeFd = null;
  }
  _construct(callBack) {
    fs.open(this.readFilePath, "r", (err, fd) => {
      if (err) return callBack(err);
      this.readFd = fd;
      fs.open(this.writeFilePath, "w", (err, fd) => {
        if (err) return callBack(err);
        this.writeFd = fd;
        callBack();
      });
    });
  }

  //так node узнает что это моя реализация метода write
  _write(chank, encoding, callback) {
    // console.log(chank);
    this.chunks.push(chank);
    this.chunksSize += chank.length;
    if (this.chunksSize >= this.writableHigWatermark) {
      fs.write(this.writeFd, Buffer.concat(this.chunks), (err) => {
        if (err) {
          return callback(err);
        } else {
          this.chunks = [];
          this.chunksSize = 0;
          callback();
        }
      });
    } else {
      callback(); //сгенерирует событие drain
    }
  }

  _read(size) {
    const buff = Buffer.alloc(size);
    fs.read(this.readFd, buff, 0, size, null, (err, bytesRead) => {
      if (err) return this.destroy(err);
      //push во внутренний буфер и будет вызванно событие data
      //если передать null то закончили
      this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null);
    });
  }

  //только тогда когда stream.end
  _final(callback) {
    console.log("FINAL:::");
    fs.write(this.writeFd, Buffer.concat(this.chunks), (err) => {
      if (err) {
        callback(err);
      } else {
        this.chunks = [];
        callback();
      }
    });
  }

  _destroy(error, callBack) {
    callBack(error);
  }
}

const duplex = new DuplexStream({
  // readableHighWatermark: 1200,
  // writableHighWatermark: 1200,
  readFilePath: "read.txt",
  writeFilePath: "write.txt",
});

duplex.write(Buffer.from("Some string!\n"));
duplex.write(Buffer.from("Some string!\n"));
duplex.write(Buffer.from("Some string!\n"));
duplex.write(Buffer.from("Some string!\n"));
duplex.write(Buffer.from("Some string!\n"));
duplex.write(Buffer.from("Some string!\n"));
duplex.end(Buffer.from("END\n")); // ТЕПЕРЬ сработает _final и запишет файл до конца

//читает из read.txt
duplex.on('data', (chunk) => {
  console.log('ПРОЧИТАНО из файла:', chunk.toString());
});
