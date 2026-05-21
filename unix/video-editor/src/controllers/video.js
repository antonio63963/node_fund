const path = require("node:path");
const crypto = require("node:crypto");
const fs = require("node:fs");
const fsPromises = require("node:fs/promises");
const { pipeline } = require("node:stream/promises");
const util = require("../../lib/util.js");
const FF = require("../../lib/FF.js");
const db = require("../DB.js");

const FORMATS_SUPPORTED = ["mov", "mp4"];

const getVideos = (req, res, handleError) => {
  db.update();
  const videos = db.videos.filter((v) => v.userId == req.userId);
  res.status(200).json(videos);
};

const uploadVideo = async (req, res, handleError) => {
  const fileName = req.headers.filename;
  const extension = path.extname(fileName).substring(1).toLowerCase();
  const name = path.parse(fileName).name;
  let dirPath;

  if (FORMATS_SUPPORTED.indexOf(extension) == -1) {
    return handleError({
      status: 400,
      message: "Not supported format video.",
    });
  }

  try {
    const videoId = crypto.randomBytes(4).toString("hex");
    dirPath = path.resolve(__dirname, "../../storage", videoId);
    console.log("DIR PATH: ", dirPath);
    await fsPromises.mkdir(dirPath);
    const fullPath = `${dirPath}/original.${extension}`;
    // const fd = await fs.open(fullPath, "w");
    const writeStream = fs.createWriteStream(fullPath);

    const thumbnailPath = `${dirPath}/thumbnail.jpg`;

    await pipeline(req, writeStream);

    //make a thumbnail video
    await FF.makeThumbnail(fullPath, thumbnailPath);

    const dimensions = await FF.getDimentions(fullPath);
    db.update();
    db.videos.unshift({
      id: db.videos.length,
      videoId,
      name,
      extension,
      dimensions,
      userId: req.userId,
    });
    db.save();
    console.log("Pipeline succeeded.");
    res.status(201).json({
      status: "success",
      message: "The file successfull uploaded",
    });
  } catch (err) {
    console.log(err.toString());
    util.deleteFolder(dirPath);
    if (err.code != "ECONNRESET") {
      return handleError(err);
    }
  }
};

const getVideoAsset = async (req, res, handleError) => {
  const videoId = req.params.get("videoId");
  const type = req.params.get("type");

  db.update();

  const video = db.videos.find((vid) => vid.videoId == videoId);
  console.log("FIND VIDEO: ", video);
  if (!video) {
    return handleError({
      status: 404,
      message: "Video not found.",
    });
  }
  let file;
  let mimeType;
  let fileName;
  let filePath;

  try {
    switch (
      type // thumbnail, audio, original, resize
    ) {
      case "thumbnail":
        filePath = path.resolve(
          __dirname,
          `../../storage/${videoId}/thumbnail.jpg`,
        );

        file = await fsPromises.open(filePath, "r");
        mimeType = "image/jpg";
        break;
      //audio
      case "audio":
        filePath = path.resolve(
          __dirname,
          `../../storage/${videoId}/audio.aac`,
        );
        file = await fsPromises.open(filePath, "r");
        mimeType = "audio.aac";
        fileName = `${video.name}-audio.aac`;
        break;
      //resize
      case "resize":
        const dimensions = req.params.get("dimensions");
        filePath = path.resolve(
          __dirname,
          `../../storage/${videoId}/${dimensions}.${video.extension}`,
        );
        file = await fsPromises.open(filePath, "r");
        mimeType = "video/mp4";
        fileName = `${video.name}-${dimensions}.${video.extension}`;
        break;
      //original
      case "original":
        filePath = path.resolve(
          __dirname,
          `../../storage/${videoId}/original.${video.extension}`,
        );
        file = await fsPromises.open(filePath, "r");
        mimeType = "video/mp4";
        fileName = `${video.name}.${video.extension}`;
        break;
    }

    const stat = await file.stat();
    const readStream = file.createReadStream();

    if (type != "thumbnail") {
      //по умолчанию
      // res.setHeader('Content-Disposition', 'inline'); //не скачиват, тодько показывает
      res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    }

    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Length", stat.size);
    res.status(200);

    await pipeline(readStream, res);
    console.log("file was sended...");
  } catch (error) {
    console.error(error.toString());
  } finally {
    file.close();
  }
};

const extractAudio = async (req, res, handleErr) => {
  const videoId = req.params.get("videoId");

  db.update();
  const video = db.videos.find((v) => v.videoId == videoId);

  if (video.extractedAudio) {
    res.status(400).json({ message: "Audio has been already extracted." });
  } else {
    const videoPath = path.resolve(
      __dirname,
      `../../storage/${videoId}/original.${video.extension}`,
    );
    const audioPath = path.resolve(
      __dirname,
      `../../storage/${videoId}/audio.aac`,
    );
    console.log("AUD ", videoPath);
    console.log("AUD aud", audioPath);
    try {
      await FF.extractAudio(videoPath, audioPath);

      video.extractedAudio = true;
      db.save();
      res.status(200).json({ message: "audio success extracted." });
    } catch (error) {
      console.log(error);
      util.deleteFile(audioPath);
      return handleErr(error);
    }
  }
};

const resizeVideo = async (req, res, handleErr) => {
  const videoId = req.body.videoId;
  const width = +req.body.width;
  const height = +req.body.height;

  const sizeName = `${width}x${height}`;

  db.update();
  const video = db.videos.find((v) => v.videoId == videoId);
  console.log("+++VIDEO: ", video, "ID: ", req.body);
  const videoPath = path.resolve(
    __dirname,
    `../../storage/${videoId}/original.${video.extension}`,
  );
  const resizedVideoTarget = path.resolve(
    __dirname,
    `../../storage/${videoId}/${sizeName}.${video.extension}`,
  );
  try {
    jobs.enque({
      type: "resize",
      videoId,
      width,
      height,
    });
    if (!video.resizes) {
      video.resizes = {};
    }
    video.resizes[sizeName] = { processing: true };

    const r = await FF.resizeVideo(
      videoPath,
      resizedVideoTarget,
      width,
      height,
    );
    console.log("R: ", r);

    video.resizes[sizeName] = { processing: false };
    db.save();
    console.log("resize finish");
    res
      .status(200)
      .json({ status: "success", message: "Resizing has been seccessfully." });
  } catch (error) {
    console.error("RESIZE: ", error);
    util.deleteFile(resizedVideoTarget);
    return handleErr(error);
  }
};

module.exports = {
  getVideos,
  uploadVideo,
  getVideoAsset,
  extractAudio,
  resizeVideo,
};
