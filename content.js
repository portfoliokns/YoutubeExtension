chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === "reset") {
    reset();
    applyFilters();
    sendResponse({ apply: true });
    return true;
  }

  if (message.command === "brightness") {
    brightness = message.value;
    applyFilters();
  }

  if (message.command === "contrast") {
    contrast = message.value;
    applyFilters();
  }

  if (message.command === "saturate") {
    saturate = message.value;
    applyFilters();
  }

  if (message.command === "grayscale") {
    grayscale = message.value;
    applyFilters();
  }

  if (message.command === "sepia") {
    sepia = message.value;
    applyFilters();
  }

  if (message.command === "hueRotate") {
    hueRotate = message.value;
    applyFilters();
  }

  if (message.command === "invert") {
    invert = message.value;
    applyFilters();
  }

  if (message.command === "blurred") {
    blurred = message.value;
    applyFilters();
  }

  if (message.command === "opacity") {
    opacity = message.value;
    applyFilters();
  }

  if (message.command === "camera") {
    takePicture().then((url) => {
      sendResponse({ url: url });
    }).catch((err) => {
      console.log('撮影に失敗しました',err)
      sendResponse({ url: null });
    });
    return true;
  }

});

var initBrightness = 1;
var initContrast = 1;
var initSaturate = 1;
var initGrayscale = 0;
var initSepia = 0;
var initHueRotate = 0;
var initInvert = 0;
var initBlurred = 0;
var initOpacity = 1;

function reset() {
  brightness = initBrightness;
  contrast = initContrast;
  saturate = initSaturate;
  grayscale = initGrayscale;
  sepia = initSepia;
  hueRotate = initHueRotate;
  invert = initInvert;
  blurred = initBlurred;
  opacity = initOpacity;
}

var brightness = initBrightness;
var contrast = initContrast;
var saturate = initSaturate;
var grayscale = initGrayscale;
var sepia = initSepia;
var hueRotate = initHueRotate;
var invert = initInvert;
var blurred = initBlurred;
var opacity = initOpacity;

function applyFilters() {
  const videoPlayer = document.querySelector('video');
  if (videoPlayer) {
    videoPlayer.style.filter = filtering()
  } else {
    console.error("動画プレーヤーが見つかりませんでした");
  }
}

function takePicture() {
  const videoPlayer = document.querySelector('video');

  if (videoPlayer) {
    let canvas = document.createElement('canvas');
    canvas.width = videoPlayer.videoWidth;
    canvas.height = videoPlayer.videoHeight;

    let ctx = canvas.getContext('2d');
    ctx.filter = filtering()
    ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        resolve(url);
      }, 'image/png');
    });
  } else {
    console.error('動画が見つかりません');
    return Promise.reject('動画が見つかりません');
  }
}

function filtering() {
  return 'brightness(' + brightness + ') ' +
          'contrast(' + contrast + ') ' +
          'saturate(' + saturate + ') ' +
          'grayscale(' + grayscale + ')' +
          'sepia(' + sepia + ')' + 
          'hue-rotate(' + hueRotate + 'deg)' +
          'invert(' + invert + ')' +
          'blur(' + blurred + 'px)' +
          'opacity(' + opacity + ')';
}