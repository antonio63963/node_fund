const MyExpress = require("./myExpress");


  const server = new MyExpress();

  server.route('GET', '/', (req, res) => {
    res.sendFile('../public/index.html');
  })

  server.listen(5555, () => {
    console.log("Server MyExpress has ran. ", server.server.address());
  });

