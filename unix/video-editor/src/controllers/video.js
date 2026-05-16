const path = require("node:path");
const crypto = require("node:crypto");
const fs = require("node:fs");
const fsPromises = require("node:fs/promises");
const { pipeline } = require("node:stream/promises");
const util = require("../../utils/util.js");
const FF = require("../../utils/FF.js");
const db = require("../DB.js");

const FORMATS_SUPPORTED = ["mov", "mp4"];

const getVideos = (req, res, handleError) => {
  const name = req.params.get("name");

  if (name) {
    res.json({ message: `You name is ${name}` });
  } else {
    return handleError({ status: 400, message: "Please specify name" });
  }
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

    const dimentions = await FF.getDimentions(fullPath);
    console.log("DIMENSIONS: ", dimentions);
    db.update();
    db.videos.unshift({
      id: db.videos.length,
      videoId,
      name,
      extension,
      dimentions,
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

module.exports = {
  getVideos,
  uploadVideo,
};
