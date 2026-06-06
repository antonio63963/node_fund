const {Worker, isMainThread, threadId } = require("node:worker_threads");

let a = 200;
//для запуска тогоже файла. new Worker(__filename) можно так
// переменный не шарятся
if(isMainThread) {
  const worker = new Worker('./isMainThread.js');
  console.log('mainThread with id: ', threadId);
a = 500;
console.log(a)
}else {
  console.log('Worker with id: ', threadId);
  console.log(a);
}