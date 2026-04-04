const { rejects } = require("assert");
const { resolve } = require("dns");
const readline = require("node:readline/promises");

class MyTerminal {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }
  async ask() {
    const message = await this.rl.question("Create a message> ");
    return message;
  }

   moveCursor(dx, dy) {
    return new Promise((resolve, reject) => {
      process.stdout.moveCursor(dx, dy, () => {
        resolve();
      });
    });
  }
   clearLine(dir) {
    return new Promise((resolve, reject) => {
      process.stdout.clearLine(dir, () => {
        resolve();
      });
    });
  }
}

module.exports = MyTerminal;
