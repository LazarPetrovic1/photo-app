// navigator.getUserMedia = navigator.webkitGetUserMedia;
const electron = require("electron");
const { ipcRenderer: ipc, shell, remote } = electron;

const images = remote.require("./images");
const effects = require("./effects");
const video = require("./video");
const flash = require("./flash");
const countdown = require("./countdown");

let canvasTarget, seriously, videoSrc;

function formatImgTag(doc, bytes) {
  const div = doc.createElement("div");
  div.classList.add("photo");
  const close = doc.createElement("div");
  close.classList.add("photoClose");
  const img = new Image();
  img.classList.add("photoImg");
  img.src = bytes;
  div.appendChild(img);
  div.appendChild(close);
  return div;
}

window.addEventListener("DOMContentLoaded", _ => {
  const videoEl = document.getElementById("video"),
    canvasEl = document.getElementById("canvas"),
    recordEl = document.getElementById("record"),
    photosEl = document.querySelector(".photosContainer"),
    counterEl = document.getElementById("counter"),
    flashEl = document.getElementById("flash");
  // ctx = canvasEl.getContext("2d");

  seriously = new Seriously();
  videoSrc = seriously.source("#video");
  canvasTarget = seriously.target("#canvas");
  effects.choose(seriously, videoSrc, canvasTarget);

  video.init(navigator, videoEl);

  recordEl.addEventListener("click", () => {
    countdown.start(counterEl, 3, () => {
      flash(flashEl);
      const bytes = video.captureBytesFromLiveCanvas(canvasEl);
      ipc.send("image-captured", bytes);
      photosEl.appendChild(formatImgTag(document, bytes));
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  });

  photosEl.addEventListener("click", evt => {
    const isRm = evt.target.classList.contains("photoClose");
    const selector = isRm ? ".photoClose" : ".photoImg";
    const photos = Array.from(document.querySelectorAll(selector));
    const index = photos.findIndex(el => el == evt.target);

    if (index > -1) {
      if (isRm) {
        ipc.send("image-remove", index);
      } else {
        shell.showItemInFolder(images.getFromCache(index));
      }
    }
  });
});

ipc.on("image-removed", (evt, index) => {
  document
    .getElementById("photos")
    .removeChild(Array.from(document.querySelectorAll(".photo"))[index]);
});

ipc.on("effect-choose", (evt, effectName) => {
  effects.choose(seriously, videoSrc, canvasTarget, effectName);
});

ipc.on("effect-cycle", evt => {
  effects.cycle(seriously, videoSrc, canvasTarget);
});
