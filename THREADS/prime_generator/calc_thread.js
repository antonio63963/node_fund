const {workerData, parentPort} = require('node:worker_threads');
const primeGenerator = require('./prime_generator');
const {performance} = require('perf_hooks');

const {threadNum, count, start} = workerData;

const startTime = performance.now();

const primeNums = primeGenerator(count, start, {format: true});

parentPort.postMessage({numbers: primeNums});

const end = performance.now() - startTime;
console.log('TIME: ', end , ' ms');