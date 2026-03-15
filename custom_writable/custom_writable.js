const { Writable } = require("node:stream");
const fs = require("node:fs");

class FileWritableStream extends Writable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });
    this.file = fileName;
    this.fd = null;
    this.chanks = [];
    this.chanksSize = 0;
    this.count = 0;
  }
  // будет вызван после запуска конструктора и до того как поток
  // запишет. Пока не выполнится его callback все остальные методы ждут
  // как initState в flutter для инициализации
  _construct(callback) {
    fs.open(this.file, 'w', (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        //no argumen == success!!!
        callback();
      }
    });
  }
  
  //так node узнает что это моя реализация метода write
  _write(chank, encoding, callback) {
    console.log(this.fd);
    this.chanks.push(chank);
    this.chanksSize += chank.length;
    if (this.chanksSize >= this.writableHighWaterMark) {
      fs.write(this.fd, Buffer.concat(this.chanks), (err) => {
        if (err) {
          return callback(err);
        } else {
          this.chanks = [];
          this.chanksSize = 0;
          ++this.count;
          callback();
        }
      });
    } else {
      callback(); //сгенерирует событие drain
    }
  }

  //только тогда когда stream.end
  _final(callback) {
    fs.write(this.fd, Buffer.concat(this.chanks), (err) => {
      if (err) {
        callback(err);
      } else {
        this.chanks = [];
        // this.chanksSize = 0;
        callback();
      }
    });
  }
  _destroy(error, callBack) {
    console.log('COUNT: ', this.count);
    if(this.fd) {
      fs.close(this.fd, (err, callback)=> {
        if(err) {
          callBack(err || error);
        }else {
          //error maybe null
          callBack(error);
        }
      })
    }
  }
}

const stream = new FileWritableStream({
  highWaterMark: 1800,
  fileName: "text.txt",
});
stream.write(Buffer.from("Some string for buffer. "));
stream.end(Buffer.from("STREAM END..."));
stream.on('finish', () => {
  console.log('Stream finished');
})