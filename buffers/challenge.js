const {Buffer, constants} = require('node:buffer');

// const myBuff = Buffer.alloc(3);

// myBuff[0] = 0x48;
// myBuff[1] = 0x69;
// myBuff[2] = 0x21;

// myBuff.forEach((b) => console.log(b));

// console.log(myBuff.toString("utf8"));

// ИЛИ

const buff = Buffer.from([0x48, 0x69, 0x21]);
console.log(buff.toString("utf8"));
// ИЛИ
const buff2= Buffer.from("486921", 'hex');
// ну или
const buff3 = Buffer.from("Hi!", 'utf8');
console.log(buff3.toString("hex"));

console.log(22 >>> 1);

console.log('SIZE: ', Buffer.poolSize >>> 1)
console.log(constants.MAX_LENGTH / 1024 /1024); // В байтах