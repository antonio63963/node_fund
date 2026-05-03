const http = require("node:http");

const PORT = "5051";

const server = http.createServer();

server.on("request", (request, response) => {
  //3 части: метод url, headers, body;
  console.log("-----METHOD-----");
  console.log(request.method);

  console.log("-----URL-----");
  console.log(request.url);

  console.log("-----HEADERS-----");
  console.log(request.headers);

  console.log("-----BODY-----");
  console.log(request.body);

  //request не server!!!
  let data= '';
  request.on('data', (chunk) => {
    console.log('CHUNK: ', chunk);
    data += chunk.toString();
    // data += '|||'
    console.log('DATA: ', data);
  });

  request.on('end', () => {
    data = JSON.parse(data);    
    console.log(data);
    // const parsed = data.slice(0, data.length-3).split('|||').map((i) => {
    //   console.log(JSON.parse(i));
    //   return JSON.parse(i);
    // });
    // console.log(parsed);

    response.writeHead(200, {"Content-Type": "application/json"});
    response.end(JSON.stringify({"message": 'POST CREATED!'}));
  })
});

server.listen(PORT, () => {
  console.log("SERVER HAS RAN ", server.address());
});
