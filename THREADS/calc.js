const { Worker, workerData, parentPort} = require("node:worker_threads");

// const { port, thread } = workerData;

// port.postMessage({ message: "HEHEHEHEHE! from ", thread: thread });
// port.on("message", (msg) => {
//   console.log("message: ", msg);
// });

//var#5
parentPort.postMessage({ message: "HEHEHEHEHE! from ", thread: workerData.name });
parentPort.on("message", (msg) => {
  console.log("message: ", msg);
});
