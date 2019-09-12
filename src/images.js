const path = require("path");
const fs = require("fs");
const shell = require("electron").shell;
const spawn = require("child_process").spawn;

const logError = err => err && console.error(err);

let images = [];

exports.save = (picturesPath, contents, done) => {
  const base64Data = contents.replace(/^data:image\/png;base64,/, "");
  const filename = new Date().toString().replace(/[^a-z0-9\-]/gi, "_");
  const imagePath = path.join(picturesPath, `${filename}.png`);
  fs.writeFile(imagePath, base64Data, { encoding: "base64" }, err => {
    if (err) {
      return logError(err);
    }
    done(null, imagePath);
  });
  console.log(picturesPath);
};

exports.getPicturesDir = app => {
  return path.join(app.getPath("pictures"), "photobombth");
};

exports.mkdir = picturesPath => {
  fs.stat(picturesPath, (err, stats) => {
    if (err && err.code !== "ENOENT") {
      return logError(err);
    } else if (err || !stats.isDirectory()) {
      fs.mkdir(picturesPath, logError);
    }
  });
};

exports.rm = (index, done) => {
  fs.unlink(images[index], err => {
    if (err) return logError(err);
    images.splice(index, 1);
    done();
  });
};

exports.cache = imgPath => {
  images = images.concat([imgPath]);
  return images;
};

exports.getFromCache = index => {
  return images[index];
};

const openCmds = {
  darwin: "open",
  win32: "explorer",
  linux: "nautilus"
};

exports.openDir = dirPath => {
  const cmd = openCmds[process.platform];
  if (cmd) {
    spawn(cmd, [dirPath]);
  } else {
    shell.showItemInFolder(dirPath);
  }
};
