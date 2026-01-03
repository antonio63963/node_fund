const fs = require("node:fs/promises");

class FileHandler {
  static createFile = async (path) => {
    try {
      const fd = await fs.open(path, "r");
      fd.close();
      console.log("File was created");
    } catch (err) {
      console.log(err);
      const fd = await fs.open(path, "w");
      fd.close();
    }
  };

  static delete = async (path) => {
    try {
      //await fs.rm(path);// для множественного удаления
      await fs.unlink(path); 
    } catch (err) {
      if (err.code == "ENOENT") {
        console.log("Файла уже нет.");
      } else {
        console.log("Something has gone wrong...", err.toString());
      }
    }
  };

  static rename = async (oldPath, newPath) => {
    try {
      await fs.rename(oldPath, newPath);
    } catch (err) {
      if (err.code == "ENOENT") {
        console.log("No such a file...", oldPath, err);
      } else {
        console.log(err);
      }
    }
  };

  static addToFile = async (path, content) => {
    try {
      await fs.appendFile(path, content);
    } catch (err) {
      if (err.code == "ENOENT") {
        console.log("NO such a file...");
      } else {
        console.log(err);
      }
    }
  };
}

module.exports = FileHandler;
