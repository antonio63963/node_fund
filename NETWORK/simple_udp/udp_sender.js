const dgram = require('node:dgram');
const { bytes } = require('node:stream/consumers');

const sender = dgram.createSocket({type: 'udp6', sendBufferSize: 20000});

sender.send('Hello world!!!', 5050, '::1', (error, bytes) => {
  if(error) console.log(error);
  console.log(bytes);
});