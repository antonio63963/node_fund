const net = require("net");

const socket = net.createConnection({ host: "localhost", port: 5051 }, () => {
  //преобразует hex в двоичный
  const headers = Buffer.from(
    "504f5354202f6372656174652d706f737420485454502f312e310d0a436f6e74656e742d547970653a206170706c69636174696f6e2f6a736f6e0d0a486f73743a205b3a3a5d3a353035310d0a436f6e6e656374696f6e3a206b6565702d616c6976650d0a5472616e736665722d456e636f64696e673a206368756e6b65640d0a0d0a",
    "hex"
  );

  const body = Buffer.from(
    "7b227469746c65223a2248492c205448455245212e2e227d7b22626f6479223a224d79206c617374206d65737361676521227d",
    "hex"
  );

  socket.write(Buffer.concat([headers, body]));
  socket.on("data", (data) => {
    console.log("MSG: ", data.toString());
    socket.end();
  });
});

socket.on("end", () => {
  console.log("COnneCtion End");
});

// 0000   50 4f 53 54 20 2f 63 72 65 61 74 65 2d 70 6f 73   POST /create-pos
// 0010   74 20 48 54 54 50 2f 31 2e 31 0d 0a 43 6f 6e 74   t HTTP/1.1..Cont
// 0020   65 6e 74 2d 54 79 70 65 3a 20 61 70 70 6c 69 63   ent-Type: applic
// 0030   61 74 69 6f 6e 2f 6a 73 6f 6e 0d 0a 48 6f 73 74   ation/json..Host
// 0040   3a 20 5b 3a 3a 5d 3a 35 30 35 31 0d 0a 43 6f 6e   : [::]:5051..Con
// 0050   6e 65 63 74 69 6f 6e 3a 20 6b 65 65 70 2d 61 6c   nection: keep-al
// 0060   69 76 65 0d 0a 54 72 61 6e 73 66 65 72 2d 45 6e   ive..Transfer-En
// 0070   63 6f 64 69 6e 67 3a 20 63 68 75 6e 6b 65 64 0d   coding: chunked.
// 0080   0a 0d 0a                                          ...

// POST /create-post HTTP/1.1..Content-Type: application/json..Host: [::]:5051..Connection: keep-alive..Transfer-Encoding: chunked.

// 504f5354202f6372656174652d706f737420485454502f312e310d0a436f6e74656e742d547970653a206170706c69636174696f6e2f6a736f6e0d0a486f73743a205b3a3a5d3a353035310d0a436f6e6e656374696f6e3a206b6565702d616c6976650d0a5472616e736665722d456e636f64696e673a206368756e6b65640d0a0d0a

// 7b227469746c65223a2248492c205448455245212e2e227d7b22626f6479223a224d79206c617374206d65737361676521227d
