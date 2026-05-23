const db = require("../src/DB.js");
const FF = require("./FF.js");
const util = require("./util.js");
const path = require("node:path");

console.log("DIRNAME: ", __dirname);

class JobsQueue {
  constructor() {
    this.jobs = [];
    this.currentJob = null;
    //инит очереди при перезагрузке сервера, если есть незавершенные
    db.update();
    const videosList = db.videos;
    if (videosList != null || videosList.length) {
      videosList.forEach((video) => {
        console.log("OBJ KEYS: ", video);
        if (!video.resizes) return;
        Object.keys(video.resizes).forEach((s) => {
          if (video[s].processing) {
            const { width, height } = s.split("x");
            this.enqueue({
              type: "resize",
              videoId: video.videoId,
              width,
              height,
            });
          }
        });
      });
    }
  }
  enqueue(job) {
    this.jobs.push(job);
    this.executeNext();
  }
  dequeue() {
    return this.jobs.shift();
  }
  executeNext() {
    if (this.currentJob) return;
    this.currentJob = this.dequeue();
    if (!this.currentJob) return;

    this.execute(this.currentJob);
  }
  async execute(job) {
    if (job.type == "resize") {
      db.update();
      const { videoId, width, height } = job;
      const video = db.videos.find((v) => v.videoId == videoId);
      const sizeName = `${width}x${height}`;
      const videoPath = path.resolve(
        __dirname,
        `../storage/${videoId}/original.${video.extension}`,
      );
      const resizedVideoTarget = path.resolve(
        __dirname,
        `../storage/${videoId}/${sizeName}.${video.extension}`,
      );
      console.log("video: ", video);
      try {
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

        db.update();
        video.resizes[sizeName] = { processing: false };
        db.save();
        console.log("resize finish! Jobs rest amount ", this.jobs.length);
      } catch (error) {
        console.error("RESIZE ERROR: ", error);
        util.deleteFile(resizedVideoTarget);
      } finally {
        this.currentJob = null;
        this.executeNext();
      }
    }
  }
}

module.exports = JobsQueue;
