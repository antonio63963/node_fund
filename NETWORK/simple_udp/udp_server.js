const dgram = require('node:dgram'); // для передачи датаграм udp

const receiver = dgram.createSocket('udp6');

receiver.on('message',(message, rInfo) => {
  console.log(rInfo);
  console.log(message.toString());
});

receiver.bind({port: 5050, address: '::1'});

receiver.on('listening', () => {
  console.log(receiver.address());
})

