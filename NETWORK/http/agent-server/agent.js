const http = require("node:http");

const agent = new http.Agent({ keepAlive: true });

const request = http.request({
  agent: agent,
  host: "::",
  port: 5051,
  method: "POST",
  path: "/create-post",
  headers: {
    "Content-Type": "application/json",
    // отправляет целиком, сервер знает размер файла
    // "Content-Length": Buffer.byteLength(
    //   JSON.stringify({ message: "HI, THERE!..", someNum: 34 }),
    //   "utf-8"
    // ),
  },
});
request.on("response", (response) => {
  console.log("=================");
  console.log(response.statusCode);
  console.log(response.headers);
  console.log(response.body);

  response.on("data", (chunk) => {
    console.log(chunk.toString());
  });

  response.on("end", () => {
    console.log("NO more data...");
  });
});

request.write(JSON.stringify({ title: "HI, THERE!.." }));

// для завершения если отправка чанками по умолчанию без content-length a transfer-encoding
request.end(JSON.stringify({ body: "My last message!" }));
