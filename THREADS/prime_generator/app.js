const { Worker, workerData } = require("node:worker_threads");

const THREADS = 4;
const count = 200;

let completed = 0;
const result = [];

for (let i = 0; i < THREADS; i++) {
  const thread1 = new Worker("./calc_thread.js", {
    workerData: {
      threadNum: i+1,
      count: count / THREADS,
      start: 100_000_000_000_000n + BigInt(i * 300),
    },
  });
  console.log("THREAD WAS STARTED: ", thread1.threadId);
  thread1.on("message", (msg) => {
    result.push(msg.numbers);
  });
  thread1.on("error", (error) => {
    console.error("Error: ", error);
  });
  thread1.on("exit", (code) => {
    console.log("Worker ", thread1.threadId, " exit with code ", code);
    completed++;
    if(completed === THREADS) {
      console.log(result.sort())
    }
    if(code !=0) {
      console.error('ERRROR....')
    }
  });
}
