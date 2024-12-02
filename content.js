let videoPlayer = document.querySelector('video');

window.addEventListener('load', function() {
  chrome.storage.local.get(['isClipMode', 'clipStartTime', 'clipEndTime'], function(result) {
    if (result.isClipMode === undefined) { result.isClipMode = false }

    if (result.isClipMode) {
      clipStartTime = result.clipStartTime;
      clipEndTime = result.clipEndTime;
      setClipVideo("clip");
      chrome.storage.local.set({ clipModeStart: 0 });
      chrome.storage.local.set({ clipModeEnd: 60 });
      chrome.storage.local.set({ isClipMode: false });
    }
  });

  //拡張機能を入れると同時に、上部の影は一切表示されなくなります。
  const shadowTop = document.querySelector('.ytp-gradient-top');
  if (shadowTop) {
    shadowTop.style.display = 'none';
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === "getPlayerParameters" ) {
    sendResponse({
      brightness: brightness,
      contrast: contrast,
      saturate: saturate,
      grayscale: grayscale,
      sepia: sepia,
      hueRotate: hueRotate,
      invert: invert,
      blurred: blurred,
      opacity: opacity,
      leftRightReverse: leftRightReverse,
      upDownReverse: upDownReverse,
      hideControls: hideControls,
      clipStartTime: clipStartTime,
      clipEndTime: clipEndTime,
      isClipMode: isClipMode
    });
    return true;
  }

  if (message.command === "reset") {
    resetFilters();
    applyFilters();
    resetPlayerReverse();
    resetController();
    setClipVideo(message.command);
    resetClipVideoTime();
    sendResponse({ apply: true });
    return true;
  }

  if (message.command === "brightness") {
    brightness = message.value;
    applyFilters();
    return;
  }

  if (message.command === "contrast") {
    contrast = message.value;
    applyFilters();
    return;
  }

  if (message.command === "saturate") {
    saturate = message.value;
    applyFilters();
    return;
  }

  if (message.command === "grayscale") {
    grayscale = message.value;
    applyFilters();
    return;
  }

  if (message.command === "sepia") {
    sepia = message.value;
    applyFilters();
    return;
  }

  if (message.command === "hueRotate") {
    hueRotate = message.value;
    applyFilters();
    return;
  }

  if (message.command === "invert") {
    invert = message.value;
    applyFilters();
    return;
  }

  if (message.command === "blurred") {
    blurred = message.value;
    applyFilters();
    return;
  }

  if (message.command === "opacity") {
    opacity = message.value;
    applyFilters();
    return;
  }

  if (message.command === "leftRight") {
    leftRightReverse = !leftRightReverse
    playerReverse();
    return;
  }

  if (message.command === "upDown") {
    upDownReverse = !upDownReverse
    playerReverse();
    return;
  }

  if (message.command === "hideControls") {
    hideControls = !hideControls;
    hideController();
    return;
  }

  if (message.command === "camera" || message.command === "clipSave") {
    takePicture().then((url) => {
      sendResponse({ url: url });
    }).catch((err) => {
      console.log('撮影に失敗しました',err)
      sendResponse({ url: null });
    });
    return true;
  }

  if (message.command === "clip") {
    clipStartTime = message.startTime;
    clipEndTime = message.endTime;
    setClipVideo(message.command)
    return;
  }

  if (message.command === "clipEnd") {
    setClipVideo(message.command)
    return;
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

function resetFilters() {
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
  if (videoPlayer) {
    videoPlayer.style.filter = filtering()
  } else {
    console.log("動画プレーヤーが見つかりませんでした");
  }
}

function takePicture() {
  if (videoPlayer) {
    let canvas = document.createElement('canvas');
    canvas.width = videoPlayer.videoWidth;
    canvas.height = videoPlayer.videoHeight;

    let ctx = canvas.getContext('2d');
    if (leftRightReverse) {
      ctx.scale(-1, 1); // 左右反転
      ctx.translate(-canvas.width, 0);
    }
    if (upDownReverse) {
      ctx.scale(1, -1); // 上下反転
      ctx.translate(0, -canvas.height);
    }
    ctx.filter = filtering()
    ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        resolve(url);
      }, 'image/png');
    });
  } else {
    console.log('動画が見つかりません');
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

function isVideoPage() {
  // YouTubeの動画ページかクリップページかを判定
  return window.location.pathname.includes('/watch') || window.location.pathname.includes('/clip');
}

let observedVideoPlayer;
let observerConnected = true; // 監視が接続されているかどうかのフラグ

function observeVideoElement() {
  //トップページで動画要素が出現してしまうため、特定のページのみで処理を走らせる
  if (!isVideoPage()) {
    console.log('動画ページではないため、処理をスキップ');
    return;
  }

  observedVideoPlayer = document.querySelector('video');
  if (observedVideoPlayer && observerConnected) {
    // 動画が再生中である場合のみ処理を実行
    if (!observedVideoPlayer.paused) {
      observedVideoPlayer.addEventListener('loadeddata', function() {
        if (videoPlayer === null) { videoPlayer = document.querySelector('video') };
        resetFilters();
        applyFilters();
        resetPlayerReverse();
        resetController();
        setClipVideo("reset");
        console.log('動画のフィルターやパラメータをリセットしました');
      });

      // 最初に動画要素が見つかったときのみ監視を停止
      if (observerConnected) {
        observer.disconnect();
        observerConnected = false; // 監視停止フラグを立てる
      }
    }
  } else {
    console.log('動画が見つかりません');
  }
}

// DOMの変更を監視
const observer = new MutationObserver((mutations) => {
  for (let mutation of mutations) {
    if (mutation.type === 'childList') {
      // 新しい動画要素が読み込まれた可能性があるためチェック
      observeVideoElement();
    }
  }
});

// YouTubeの動画プレーヤーのコンテナを監視対象に設定
observer.observe(document.body, { childList: true, subtree: true });

let leftRightReverse = false;
let upDownReverse = false;
function playerReverse() {
  if (!videoPlayer) {
    console.log("動画プレーヤーが見つかりませんでした");
    return;
  }

  let scale
  if (leftRightReverse & upDownReverse) {
    scale = "scale(-1, -1)";
  } else if (!leftRightReverse & upDownReverse) {
    scale = "scale(1, -1)";
  } else if (leftRightReverse & !upDownReverse) {
    scale = "scale(-1, 1)";
  } else {
    scale = "scale(1, 1)";
  }
  videoPlayer.style.transform = scale;
}

function resetPlayerReverse() {
  if (!videoPlayer) {
    console.log("動画プレーヤーが見つかりませんでした");
    return;
  }
  
  leftRightReverse = false;
  upDownReverse = false;
  videoPlayer.style.transform = "scale(1, 1)";
}

let hideControls = false;
const shadowBottom = document.querySelector('.ytp-gradient-bottom');
const controller = document.querySelector('.ytp-chrome-bottom');
const icon = document.querySelector('.branding-img');
const container = document.querySelector('.ytp-chrome-top');
const endScreenElements = document.querySelectorAll('[class^="ytp-ce-element"]');
function hideController() {
  if (hideControls) {
    if (shadowBottom) {shadowBottom.style.display = 'none' };
    if (controller) {controller.style.display = 'none';};
    if (icon) {icon.style.display = 'none';};
    if (container) {container.style.display = 'none';};
    endScreenElements.forEach(element => {
      element.style.display = 'none';
    });
  } else {
    if (shadowBottom) {shadowBottom.style.display = 'block' };
    if (controller) {controller.style.display = 'block';};
    if (icon) {icon.style.display = 'block';};
    if (container) {container.style.display = 'block';};
    endScreenElements.forEach(element => {
      element.style.display = 'block';
    });
  }
}

function resetController() {
  if (shadowBottom) {shadowBottom.style.display = 'block' };
  if (controller) {controller.style.display = 'block';};
  if (icon) {icon.style.display = 'block';};
  if (container) {container.style.display = 'block';};
  endScreenElements.forEach(element => {
    element.style.display = 'block';
  });
  hideControls = false;
}

let isClipMode = false;
let initClipStartTime = 0;
let initClipEndTime = 60;
let clipStartTime = initClipStartTime;
let clipEndTime = initClipEndTime;
function setClipVideo(request) {
  if (!videoPlayer) {
    console.log("動画プレーヤーが見つかりませんでした");
    return;
  }

  if (request === "clip") {
    resetClipVideo();
    applyClipVideo(clipStartTime, clipEndTime);
    seekToTimeClipVideo(clipStartTime);
    isClipMode = true;
  } else {
    resetClipVideo();
    resetClipVideoTime();
    isClipMode = false;
  }
}

let playListener, timeupdateListener, seekedListener;
function applyClipVideo(startTime, endTime) {

  if (videoPlayer.currentTime < startTime || videoPlayer.currentTime >= endTime) {
    videoPlayer.currentTime = startTime;
  }

  if (playListener) {
    playListener = null;
  }

  if (timeupdateListener) {
    timeupdateListener = null;
  }

  if (seekedListener) {
    seekedListener = null;
  }

  if (!playListener) {
    playListener = () => play(startTime, endTime);
  }
  if (!timeupdateListener) {
    timeupdateListener = () => timeupdate(startTime, endTime);
  }
  if (!seekedListener) {
    seekedListener = () => seeked(startTime, endTime);
  }

  videoPlayer.addEventListener("play", playListener);
  videoPlayer.addEventListener("timeupdate", timeupdateListener);
  videoPlayer.addEventListener("seeked", seekedListener);
}

function seekToTimeClipVideo(startTime) {
  videoPlayer.currentTime = startTime;
}

function resetClipVideo() {
  if (playListener) videoPlayer.removeEventListener("play", playListener);
  if (timeupdateListener) videoPlayer.removeEventListener("timeupdate", timeupdateListener);
  if (seekedListener) videoPlayer.removeEventListener("seeked", seekedListener);
}

function play(startTime, endTime) {
  if (videoPlayer.currentTime < startTime || videoPlayer.currentTime >= endTime) {
    videoPlayer.currentTime = startTime;
  }
}

function timeupdate(startTime, endTime) {
  if (videoPlayer.currentTime >= endTime) {
    videoPlayer.currentTime = startTime;
  }
}

function seeked(startTime, endTime) {
  if (videoPlayer.currentTime < startTime || videoPlayer.currentTime > endTime) {
    videoPlayer.currentTime = startTime;
  }
}

function resetClipVideoTime() {
  clipStartTime = initClipStartTime;
  clipEndTime = initClipEndTime;
}