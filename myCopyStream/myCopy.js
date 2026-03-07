const fs = require("node:fs/promises");

async function myCopy() {
  let srcFile, destFile;
  try {
    console.time("myCopy");
    srcFile = await fs.open("text-small.txt", "r");
    destFile = await fs.open("dest.txt", "w");

    let bytesReadRes = -1;

    while (bytesReadRes != 0) {
      const { bytesRead, buffer } = await srcFile.read();
      bytesReadRes = bytesRead;
      //обрезка null
      if (bytesRead != 16384) {
        await destFile.write(buffer.subarray(0, bytesRead));
      } else {
        await destFile.write(buffer);
      }
    }
    console.timeEnd("myCopy");
  } catch (error) {
    console.log(error);
  } finally {
    // Обязательно закрываем файлы
    if (srcFile) await srcFile.close();
    if (destFile) await destFile.close();
  }
}

+(function () {
  myCopy();
})();
