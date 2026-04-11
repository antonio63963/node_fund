const net = require("node:net");
const fs = require("node:fs/promises");

const server = net.createServer(() => {});

server.on("connection", (socket) => {
  console.log("NEW CONNECTION.");
  let fd;
  let fileStream;
  socket.on("data", async (data) => {
    console.log("CHANK: ", data.toString());
    if (fd == null) {
      //на открытие файла уйдет какое то время и могут прийти новые данные
      socket.pause();
      fd = await fs.open(`storage/test.txt`, "w");
      fileStream = fd.createWriteStream();
      fileStream.write(data);
      socket.resume(); // возвращаю получение данных
    }else {
      //заполнился
      if (!fileStream.write(data)) {
        fileStream.pause();
      }
      fileStream.on("drain", (data) => {
        fileStream.resume();
      });

    }
  });

  socket.on("end", () => {
    console.log("end...");
    fd.close();
    fileStream.close();
  });
});

server.listen(5050, "::1", () => {
  console.log("SERVER HAS RAN.", server.address());
});
