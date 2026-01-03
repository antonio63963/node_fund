const {Buffer} = require('buffer');

const memoryContainer = Buffer.alloc(4);

console.log(memoryContainer);

memoryContainer[0] = 0xf4;
memoryContainer[1] = 0x23;
//запись отриц. -34 в 8 битах(2 байтах)
memoryContainer.writeInt8(-38, 2);
memoryContainer[3] = 0xff;

memoryContainer.forEach((m) => console.log(m));
// прочесть отриц
console.log(memoryContainer.readInt8(2));
console.log('TO STRING ', memoryContainer.toString("hex"))