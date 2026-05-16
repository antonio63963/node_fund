const cluster = require("node:cluster");
console.log("======");

if (cluster.isPrimary) {
  console.log("THIS IS PARENT PROCESS PID: ", process.pid);
  const coresAmount = require("node:os").availableParallelism();
  for (let i = 0; i < coresAmount; i++) {
    const worker = cluster.fork();

    worker.send("Hello world!!!");

    console.log("Child process run PID: ", worker.process.pid);
  }

  cluster.on("message", (worker, message) => {
    console.log(`Worker: ${worker.process.pid} message: ${message.action}`);
  });

  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid}, code: ${code}, signal: ${signal}`,
    );
    // if(code) {
    //   cluster.fork();
    // }
    cluster.fork();
  });
} else {
  console.log("This is child process...");
  require("./server.js");
}
