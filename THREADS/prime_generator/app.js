const primeGenerator = require('./prime_generator');
const {performance} = require('perf_hooks');

const start = performance.now();

console.log(primeGenerator(10, 100_000_000_000_000n));

const end = performance.now() - start;
console.log('TIME: ', end , ' ms');