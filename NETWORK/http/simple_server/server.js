const http = require("node:http");
const fs = require("node:fs/promises");
const { pipeline } = require("node:stream/promises");

const server = http.createServer();

server.on("request", async (req, res) => {
  console.log("URL: ", req.url);
  if (req.url === "/" && req.method === "GET") {
    let fd;
    try {
      res.setHeader("Content-Type", "text/html; charset=utf-8");

      fd = await fs.open("./public/index.html", "r");
      const readStream = fd.createReadStream();

      await pipeline(readStream, res);
    } catch (error) {
      console.error(error);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    } finally {
      if (fd) {
        await fd.close();
        console.log("Файл закрыт успешно.");
      }
    }
  }

  if (req.url === "/styles.css" && req.method === "GET") {
    let fd;
    try {
      res.setHeader("Content-Type", "text/css; charset=utf-8");

      fd = await fs.open("./public/styles.css", "r");
      const readStream = fd.createReadStream();

      await pipeline(readStream, res);
    } catch (error) {
      console.error(error);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    } finally {
      if (fd) {
        await fd.close();
        console.log("Файл закрыт успешно.");
      }
    }
  }

  if (req.url === "/main.js" && req.method === "GET") {
    let fd;
    try {
      res.setHeader("Content-Type", "text/javascript; charset=utf-8");
      const fd = await fs.open("./public/main.js", "r");

      const readStream = fd.createReadStream();

      await pipeline(readStream, res);
      console.log("JS отдан");
    } catch (error) {
      if (!res.headersSent) {
        res.statusCode = 500;
        res.end("Internal server error.");
      }
    } finally {
      if (fd) {
        fd.close();
      }
    }
  }

  if (req.url === "/login" && req.method === "POST") {
    res.setHeader("Content-Type", "text/json");
    res.statusCode = 200;
    const body = {
      message: "Your are welcome...",
    };
    // res.body = JSON.stringify(body);
    // res.write(JSON.stringify(body));
    res.end(JSON.stringify(body));
  }

  if (req.url === "/user" && req.method === "PUT") {
    res.setHeader("Content-Type", "text/json");
    res.statusCode = 401;

    res.end(JSON.stringify({ message: "First you need authorize..." }));
  }

  if (req.url === "/upload" && req.method === "POST") {
    const fd = await fs.open("./storage/image.jpg", "w");
    const writeStream = fd.createWriteStream();

    await pipeline(req, writeStream);
    res.setHeader("Content-Type", "text/json; charset=utf-8");
    res.statusCode = 200;
    res.end(JSON.stringify({ message: "File loaded successful." }));

    console.log("File has wrote");
  }
});

server.listen(5252, () => {
  console.log("SERver started...", server.address());
});
