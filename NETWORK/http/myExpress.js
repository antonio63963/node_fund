const http = require("node:http");
const p = require("node:path");
const fs = require("node:fs/promises");
const { pipeline } = require("node:stream/promises");

class MyExpress {
  static mimeTypes = {
    html: "text/html",
    js: "text/javascript",
    css: "text/css",
    png: "image/png",
    jpg: "image/jpeg",
  };
  constructor() {
    this.server = http.createServer();
    this.routes = {};

    this.server.on("request", (req, res) => {
      res.sendFile = async (path) => {
        let fd;
        try {
          const ext = p.extname(path).slice(1);
          console.log("EXT: ", ext);

          const mimeType =
            MyExpress.mimeTypes[ext] || "application/octet-stream";

          res.setHeader("Content-Type", `${mimeType}; charset=utf-8`);

          fd = await fs.open(path, "r");
          const readStream = fd.createReadStream();

          await pipeline(readStream, res);
        } catch (error) {
          console.error(error.message);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.end("Internal Server Error");
          }
        } finally {
          if (fd) {
            fd.close();
          }
        }
      };
      res.status = (code) => {
        res.statusCode = code;
        return res;
      };
      // for small json data that less than HighWattermark stream
      // res.writableHighWatermark; req.readableHighWatermark

      res.json = (obj) => {
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(JSON.stringify(obj));
      };

      //++++++++++++++++++++++++++++++
      const route = req.method.toLowerCase() + req.url;
      console.log("+++ROUTE: ", route);
      if (this.routes[route]) {
        console.log("===FN: ", this.routes[route]);
        this.routes[route](req, res);
      } else {
        res
          .status(404)
          .json({ message: "Source not found...", route: req.url });
      }
    });
  }

  listen(port, callback) {
    this.server.listen(port, callback);
  }

  route = (method, url, cb) => {
    this.routes[method.toLowerCase() + url] = cb;
    console.log("+++++ROUTES: ", this.routes);
  };
}

module.exports = MyExpress;
