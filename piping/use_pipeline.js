const fs = require("node:fs/promise");
// pipeline дает обработку ошибок и авто закрытие стрима в отличии от pipe 
//если pipe то с либой pump или если ручное то с stream.finished
const { pipeline } = require("node:stream");

const path = require("node:path");

async function usePipeline() {
  console.time("usePipline");
  const srcFile = await fs.open(
    path.join(__dirname, "../myCopyStream/text-small.js", "r")
  );
  const destFile = await fs.open("pipeDest.txt", "w");

  const rs = srcFile.createReadStream();
  const ws = destFile.createWriteStream();

  // между srcFile и destFile могут быть дуплекс или трансформ потоки
  pipeline(rs, ws, (err) => {
    console.timeEnd("usePipline");
    console.log(err);
  });
}

(async function () {
  usePipeline();
})();
