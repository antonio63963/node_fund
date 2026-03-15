const fs = require("node:fs/promises");
const path = require("node:path");

async function myCopyPiping() {
  try {
    console.time("myCopy");
    srcFile = await fs.open(
      path.join(__dirname, "../myCopyStream/text-small.txt"),
      "r"
    );
    destFile = await fs.open("dest.txt", "w");

    const readStream = srcFile.createReadStream();
    const writeStream = destFile.createWriteStream();

    readStream.pipe(writeStream);

    readStream.on("end", () => {
      console.timeEnd("myCopy");
    });
  } catch (error) {
    console.log(error);
  } finally {
    // Обязательно закрываем файлы
    // if (srcFile) await srcFile.close();
    // if (destFile) await destFile.close();
  }
}

+(function () {
  myCopyPiping();
})();
