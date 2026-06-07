const { workerData, parentPort } = require("worker_threads");
const crypto = require("crypto");
const BATCH_SIZE = 50096;//size on every batch чем больше тем реже вызываем этот
//пиздец тяжелый randomFillSync который замедляет всю систему
const buffer = Buffer.alloc(BATCH_SIZE); // объединяем несколько операций в одну
//не по 2 накаждой итерации а срв=азу пакетом
//читаем буфер по смещению 
function fillBuffer() {
  console.log('BATCH...')
  crypto.randomFillSync(buffer);
}

function readRandomNumber(offset) {
  return buffer.readUInt16BE(offset);
}

// function generateRandomNumber() {
//   crypto.randomFillSync(buffer);
//   const randomValue = buffer.readUInt16BE(0); // read the buffer as an unsigned 16-bit integer
//   return randomValue;
// }

let sum = 0;
let random;
let bufferOffset = 0;

fillBuffer();

for (let i = 0; i < workerData.count; i++) {
  if(bufferOffset >= BATCH_SIZE) {
    fillBuffer();
    bufferOffset = 0;
  }

  random = readRandomNumber(bufferOffset);
  bufferOffset += 2;//2 bytes
  sum += random;

  if (sum > 100_000_000) {
    sum = 0;
  }
}

parentPort.postMessage(sum);
