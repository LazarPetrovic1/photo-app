exports.init = (nav, videoEl) => {
  const constraints = {
    audio: false,
    video: {
      // mandatory: {
      //   minWidth: 853,
      //   minHeight: 480,
      //   maxWidth: 853,
      //   maxHeight: 480
      // }
      width: {
        min: 550,
        ideal: 853,
        max: 853
      },
      height: {
        min: 480,
        ideal: 480,
        max: 480
      }
    }
  };

  function handleSuccess(videoEl, stream) {
    videoEl.src = window.URL.createObjectURL(stream);
    // console.log(videoEl.width, stream.width, videoEl.height, stream.height);
  }

  function handleError(err) {
    console.log("Sth went wrong", err);
  }

  nav.getUserMedia(
    constraints,
    stream => handleSuccess(videoEl, stream),
    handleError
  );
};

exports.captureBytes = (videoEl, ctx, canvasEl) => {
  ctx.drawImage(videoEl, 0, 0);
  return canvasEl.toDataURL("image/png");
};

exports.captureBytesFromLiveCanvas = canvasEl => {
  return canvasEl.toDataURL("image/png");
};
