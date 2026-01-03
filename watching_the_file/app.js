const fs = require("node:fs/promises");
const Cmnds = require("./cmnds_class");
const CmndsFileHandler = require("./file_handler");

(async () => {
  // const watcher = fs.watch("./"); // ЗА ВСЕЙ ПАПКОЙ
  //слежка за всей папкой
  // for await (const event of watcher) {
  //   console.log(event);
  //   if(event.eventType == 'change' && event.filename == "command.txt") {
  //     console.log('hoho! FILE changed!...');
  //   }
  // }

  const comandFileHandler = await fs.open("./command.txt");

  comandFileHandler.on("changeF", async () => {
    console.log("onChangeF....");
    const stat = await comandFileHandler.stat();
    const buff = Buffer.alloc(stat.size);
    //сколько байт хотим прочитать
    const length = stat.size; // тоже самое || buff.byteLength;
    //откуда хотим заполнить буффер
    const offset = 0;
    //с чего начать чтение
    const position = 0;
    console.log("STAT: ", stat);
    //we read whole file
    // результат будет в буфере
    await comandFileHandler.read(buff, offset, length, position);
    console.log("CONTENT: ", buff.toString("utf-8"));

    const cmd = buff.toString("utf-8");

    if (cmd.includes(Cmnds.createFile)) {
      const path = Cmnds.getCreatePath(cmd);
      CmndsFileHandler.createFile(path);
    } else if (cmd.includes(Cmnds.deleteFile)) {
      const path = Cmnds.getDeletePath();
      CmndsFileHandler.deleteFile(path);
    } else if (cmd.includes(Cmnds.renameFile)) {
      const { oldPath, newPath } = Cmnds.getOldAndNewPaths(cmd);
      await CmndsFileHandler.rename(oldPath, newPath);
    } else if (cmd.includes(Cmnds.addToFile)) {
      const { path, content } = Cmnds.getAddPathAndContent(cmd);
      CmndsFileHandler.addToFile(path, content);
    }
  });

  const watcher = fs.watch("./command.txt");
  for await (const event of watcher) {
    if (event.eventType == "change") {
      comandFileHandler.emit("changeF");
    }
  }
})();
