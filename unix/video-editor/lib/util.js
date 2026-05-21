const fs = require('node:fs/promises');

const util = {
  deleteFile : async function (path) {
    try {
      await fs.unlink(path);
    } catch (error) {
      //do nothing if not exists
    }
  },

  deleteFolder : async function (path) {
    try {
      console.log('DEL PATH: ', path);
      await fs.rm(path, {recursive: true});
    } catch (error) {
      console.log('ERROR: ', error);
      //do nothing
    }
  }
}

module.exports = util;