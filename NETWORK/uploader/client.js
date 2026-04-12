const net = require("node:net");
const fs = require("node:fs/promises");
const path = require("node:path");

const client = net.createConnection({ port: 5050, host: "::1" }, async () => {
  //при запуске node client.js <fileName> указываем 3-й аргумент файл
  console.log("PROC: ", process.argv);
  const filePath = process.argv[2];
  if (filePath == null) {
    console.log("Запустите программу с 3-м аргументом - имя файла!");
    process.exit(0);
  }
  const fileName = path.basename(filePath);
  console.log("FILE NAME: ", fileName);
  client.write(`fileName: ${fileName}|||`);

  const fd = await fs.open(filePath, "r");
  const readStream = fd.createReadStream();

  // for showing the upload progress
  let uploaderPercentage = 0;
  let bytesUploaded = 0;
  const fileSize = (await fd.stat()).size;

  readStream.on("data", (chunk) => {
    console.log("STREAM: ", chunk.toString());
    if (!client.write(chunk)) {
      readStream.pause();
    }
    bytesUploaded += chunk.length;
    let stateUpload = Math.floor((bytesUploaded / fileSize) * 100);
    if (stateUpload != uploaderPercentage) {
      uploaderPercentage = stateUpload;
      console.log("Uploading: ", uploaderPercentage, "%");
    }
  });

  client.on("drain", () => {
    readStream.resume();
  });

  readStream.on("end", () => {
    fd.close();
    readStream.destroy();
    client.end();
  });
});

client.on("data", (data) => {});
