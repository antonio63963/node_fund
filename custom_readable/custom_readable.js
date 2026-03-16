const { Readable } = require("node:stream");
const fs = require("node:fs");
const path = require("node:path");

class FileReadableStream extends Readable {
  constructor({ heighWatermark, filePath }) {
    super({ heighWatermark });
    this.heighWatermark = heighWatermark;
    this.filePath = filePath;
    this.fd = null;
  }

  _construct(callBack) {
    fs.open(this.filePath, "r", (err, fd) => {
      if (err) {
        callBack(err);
      } else {
        this.fd = fd;
        callBack();
      }
    });
  }
  _read(size) {
    const buff = Buffer.alloc(size);
    fs.read(this.fd, buff, 0, size, null, (err, bytesRead) => {
      if (err) return this.destroy(err);
      //push во внутренний буфер и будет вызванно событие data
      //если передать null то закончили
      this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null);
    });
  }

  _destroy(error, callBack) {
    if (this.fd) {
      fs.close(this.fd, (err) => callBack(err || error));
    } else {
      return callBack(error);
    }
  }
}

const streamR = new FileReadableStream({
  heighWatermark: 1200,
  filePath: path.join(__dirname, "../", "custom_writable/text.txt"),
});
streamR.on("data", (data) => {
  console.log(data.toString());
});
streamR.on("end", () => console.log("END..."));
