const net = require("node:net");
const fs = require("node:fs/promises");

const server = net.createServer(() => {});

server.on("connection", (socket) => {
  console.log("NEW CONNECTION.");

  let fd;
  let fileStream;
  let dataBuffer = Buffer.alloc(0);

  socket.on("data", async (data) => {
    if (fd == null) {
      dataBuffer = Buffer.concat([dataBuffer, data]);
      const { fileName, buff } = _ifDataIsFileName(dataBuffer);
      //на открытие файла уйдет какое то время и могут прийти новые данные
      if (fileName) {
        socket.pause();
        try {
          fd = await fs.open(`storage/${fileName.toString().trim()}`, "w");
          fileStream = fd.createWriteStream();
          if (buff != null && buff.length) {
            fileStream.write(buff);
          }
          fileStream.on("drain", () => {
            socket.resume();
          });
        } catch (error) {
          console.error("File Open Error:", err);
          socket.destroy();
        } finally {
          socket.resume(); // возвращаюсь к получению данных
        }
      }
    } else {
      //заполнился
      if (!fileStream.write(data)) {
        socket.pause();
      }
    }
  });

  socket.on("end", async () => {
    console.log("end...");
    if (fd) await fd.close();
    if (fileStream) fileStream.end();
  });
});

function _ifDataIsFileName(data) {
  const idxSeparator = data.indexOf("|||");
  if (idxSeparator == -1) {
    return { fileName: null, buff: data };
  }

  const nameHeader = data.subarray("fileName: ".length, idxSeparator);
  console.log("NAME: ", nameHeader);
  const restBuff = data.subarray(idxSeparator + "|||".length);

  return { fileName: nameHeader, buff: restBuff };
}

server.listen(5050, "::1", () => {
  console.log("SERVER HAS RAN.", server.address());
});
