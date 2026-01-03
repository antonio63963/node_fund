const { log } = require("console");

class Cmnds {
  static createFile = "create a file";
  static deleteFile = "delete the file";
  static renameFile = "rename the file";
  static toSeparator = " to ";
  static contentSeparator = " content: ";
  static addToFile = "add to file";

  static _getPath = (comandString, comand) => {
    return comandString.substring(comand.length + 1);
  };

  static getCreatePath(commandString) {
    return this._getPath(commandString, this.createFile);
  }

  static getDeletePath(commandString) {
    return this._getPath(commandString, this.deleteFile);
  }

  static getOldAndNewPaths(commandString) {
    try {
      const tail = this._getPath(commandString, this.renameFile);
      console.log("TAIL: ", tail);
      const idxEndOldPath = tail.indexOf(this.toSeparator);

      const oldPath = tail.substring(0, idxEndOldPath);
      console.log("IDX: ", idxEndOldPath + this.toSeparator.length);

      const newPath = tail.substring(idxEndOldPath + this.toSeparator.length);
      console.log("oldPath: ", oldPath, "\n", "newPath: ", newPath);
      return {
        oldPath,
        newPath,
      };
    } catch (err) {
      console.log(err);
    }
  }

  static getAddPathAndContent(commandString) {
    try {
      const cmdArgs = this._getPath(commandString, this.addToFile);
      console.log("CMND ARGS: ", cmdArgs);
      const idxEndPath = cmdArgs.indexOf(this.contentSeparator);
      if (idxEndPath === -1) {
        console.log("Разделитель содержимого не найден");
        return null;
      }
      const path = cmdArgs.substring(0, idxEndPath);
      console.log("PATH: ", path);
      const content = cmdArgs.substring(
        idxEndPath + this.contentSeparator.length,
      );
      console.log("CONTENT: ", content);
      return {
        path,
        content,
      };
      return { path: '', content: '' };
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Cmnds;
