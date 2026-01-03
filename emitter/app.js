const EventEmitter = require('events');

class Emitter extends EventEmitter {}

const myE = new Emitter();

// myE.on("em", () => {
//   console.log("EM occurred...");
// });

myE.emit("em");

module.exports = {
  mEv: myE,
}