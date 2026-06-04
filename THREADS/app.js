const { Worker, MessageChannel } = require("node:worker_threads");
const v8 = require("node:v8"); //этим не передавать типа v8.serialize({workerData: 'hohohho!'})
//<<<VARIANT#1>>>
// function cloneObj(obj) {
//   return v8.deserialize(v8.serialize(obj));
// }
// const thread1 = new Worker("./calc.js", {
//   workerData: cloneObj({ name: "Tom" }),
// });

//<<<VARIANT#2>>> messageChanel
// const channel = new MessageChannel();

// const port1 = channel.port1;
// const port2 = channel.port2;

// port1.postMessage({name: 'Tom'});

// port1.on('message', (msg) => {
//   console.log('MESSAGE P1: ', msg);
// });

// port2.on('message', (msg) => {
//   console.log('Message P2: ', msg)
// })

//<<<VARIANT#3>>> chenel between two threads child

// const { port1, port2 } = new MessageChannel();

// const thread1 = new Worker("./calc.js", {
//   workerData: { port: port1 },
//   transferList: [port1],// дает возможность передавать
//   // порт как порт и порт больше не доступен из этого основного потока
// });
// const thread2 = new Worker("./calc.js", {
//   workerData: { port: port2 },
//   transferList: [port2],// дает возможность передавать
//   // порт как порт и порт больше не доступен из этого основного потока
// });

// <<<VARIANT#4>>> main thread speaks wiht 2 childs
// const { port1, port2 } = new MessageChannel();
// const thread1 = new Worker("./calc.js", {
//   workerData: { port: port1, thread: 1 },
//   transferList: [port1],
// });
// port2.postMessage({ message: "hello thread #1" });
// port2.on("message", (msg) => {
//   console.log("MSG THREAD#1: ", msg);
// });

// const { port1: port3, port2: port4 } = new MessageChannel();

// const thread2 = new Worker("./calc.js", {
//   workerData: { port: port3, thread: 2 },
//   transferList: [port3],
// });
// port4.postMessage({ message: "hoho! thread#2!!!" });
// port4.on("message", (msg) => {
//   console.log("MSG FROM THREAD#2: ", msg);
// });

//<<<VARIANT#5>>> SIMPLE COMMUNICATION
const {port1, port2} = new MessageChannel();

const thread1 = new Worker('./calc.js', {workerData: {name: 'Tom'}});
thread1.postMessage({message: 'hello, Tom!'});
thread1.on('message', (msg) => {console.log('TREAD1: ', msg)})
