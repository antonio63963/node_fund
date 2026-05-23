const cluster = require('node:cluster');

if(cluster.isPrimary) {
  const coresAmount = require('node:os').availableParallelism;

  for(let i =0; i<coresAmount.length; i++) {
    cluster.fork();
  }

  cluster.on('message', (worker, message) => {
    
  })
}else {
  require('./index.js');
}