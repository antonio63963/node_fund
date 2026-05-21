const { spawn } = require("node:child_process");

async function makeThumbnail(fullPathVideo, thumbnailPath) {
  // Передаем строго МАССИВОМ. Никаких кавычек внутри строк городить НЕ НАДО.
  // Node.js сам обернет элементы с пробелами так, чтобы Linux их понял.
  const args = [
    "-y",
    "-ss",
    "00:00:02", // Пропускаем 2 секунды (чтобы не поймать черный экран)
    "-i",
    fullPathVideo, // Путь к исходному видео
    "-vframes",
    "1", // Берем 1 кадр
    "-f",
    "image2", // Форсируем упаковщик картинок
    "-vcodec",
    "mjpeg", // Форсируем кодек MJPEG для JPG
    thumbnailPath, // Путь к выходу
  ];
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", args);

    let errorOutput = "";

    ffmpeg.on("error", (err) => {
      return reject(err.toString());
    });
    //ffmpeg пишет сюда все.
    ffmpeg.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        console.error("FFmpeg Error Output:\n", errorOutput);
        reject(new Error(`FFmpeg failed with code ${code}`));
      }
    });

    ffmpeg.on("error", (err) => {
      reject(err);
    });
  });
}

async function getDimentions(fullPath) {
  //ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 video.mp4
  return new Promise((resolve, reject) => {
    const ffprobe = spawn("ffprobe", [
      "-v",
      "error",
      "-select_streams",
      "v:0",
      "-show_entries",
      "stream=width,height",
      "-of",
      "csv=p=0",
      fullPath,
    ]);

    ffprobe.stdout.on("data", (data) => {
      console.log("Dimentions: ", data.toString());
      const [width, height] = data.toString().split(",");
      resolve({
        width: +width,
        height: +height,
      });
    });
    ffprobe.on;
    //в stderr пишет все логи ffmpeg
    ffprobe.stderr.on("data", (data) => {
      console.log("ERROR TH: ", data);
      reject({ message: data.toString() });
    });

    ffprobe.on("close", (code) => {
      console.log("getDemensions close: ", code);
    });
  });
}

async function extractAudio(originalVideoPath, targetAudioPath) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-i",
      originalVideoPath,
      "-vn", // not catch video
      "-c:a", // copy audio
      "copy",
      targetAudioPath,
    ]);

    ffmpeg.on("error", (err) => {
      reject(err);
    });

    ffmpeg.on("close", (code) => {
      if (code == 0) {
        console.log("The audio was extracted seccessfully.");
        resolve();
      } else {
        reject(`Ffmpeg existing with code ${code}`);
      }
      console.log("extractAudio close: ", code);
    });
  });
}

async function resizeVideo(
  originalVideoPath,
  targetResizedPath,
  width,
  height,
) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-i",
      originalVideoPath,
      "-vf", // not catch video
      `scale=${width}:${height}`, // copy audio
      "-c:a",
      "copy",
      targetResizedPath,
    ]);

    ffmpeg.on("error", (err) => {
      reject(err);
    });

    ffmpeg.on("close", (code) => {
      if (code == 0) {
        console.log("The audio was extracted seccessfully.");
        resolve();
      } else {
        reject(`Ffmpeg existing with code ${code}`);
      }
      console.log("resize close: ", code);
    });
  });
}
module.exports = {
  makeThumbnail,
  getDimentions,
  extractAudio,
  resizeVideo,
};
