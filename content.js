let videoPlayer = document.querySelector("video");
let commentsTable = [];

window.addEventListener("load", function () {
  chrome.storage.local.get(
    ["isClipMode", "clipStartTime", "clipEndTime"],
    function (result) {
      if (result.isClipMode === undefined) {
        result.isClipMode = false;
      }

      if (result.isClipMode) {
        clipStartTime = result.clipStartTime;
        clipEndTime = result.clipEndTime;
        setClipVideo("clip");
        chrome.storage.local.set({ clipModeStart: 0 });
        chrome.storage.local.set({ clipModeEnd: 60 });
        chrome.storage.local.set({ isClipMode: false });
      }
    }
  );

  //拡張機能を入れると同時に、上部の影は一切表示されなくなります。
  const shadowTop = document.querySelector(".ytp-gradient-top");
  if (shadowTop) {
    shadowTop.style.display = "none";
  }

  //コメント取得
  getAllComments();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === "playStop") {
    playVideo();
    return;
  }

  if (message.command === "forward") {
    if (isAdvertisement()) return;
    forwardVideo();
    return;
  }

  if (message.command === "back") {
    if (isAdvertisement()) return;
    backVideo();
    return;
  }

  if (message.command === "upAudio") {
    upAudio();
    return;
  }

  if (message.command === "downAudio") {
    downAudio();
    return;
  }

  if (message.command === "setNumberTime") {
    let number = message.number;
    setCurrentTime(number);
    return;
  }

  if (message.command === "getPlayerParameters") {
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
      isClipMode: isClipMode,
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
      isClipMode: isClipMode,
    });
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
    leftRightReverse = !leftRightReverse;
    playerReverse();
    return;
  }

  if (message.command === "upDown") {
    upDownReverse = !upDownReverse;
    playerReverse();
    return;
  }

  if (message.command === "hideControls") {
    hideControls = !hideControls;
    hideController();
    return;
  }

  if (message.command === "clipSave") {
    takePicture()
      .then((url) => {
        sendResponse({ url: url, maxSeconds: videoPlayer.duration });
      })
      .catch((err) => {
        console.log("撮影に失敗しました", err);
        sendResponse({ url: null, maxSeconds: videoPlayer.duration });
      });
    return true;
  }

  if (message.command === "camera") {
    takePicture()
      .then((url) => {
        sendResponse({ url: url });
      })
      .catch((err) => {
        console.log("撮影に失敗しました", err);
        sendResponse({ url: null });
      });
    return true;
  }

  if (message.command === "clip") {
    clipStartTime = message.startTime;
    clipEndTime = message.endTime;
    setClipVideo(message.command);
    return;
  }

  if (message.command === "clipEnd") {
    setClipVideo(message.command);
    return;
  }

  if (message.command === "getNowSeconds") {
    sendResponse({ seconds: videoPlayer.currentTime });
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
    videoPlayer.style.filter = filtering();
  } else {
    console.log("動画プレーヤーが見つかりませんでした");
  }
}

function takePicture() {
  if (videoPlayer) {
    let canvas = document.createElement("canvas");
    canvas.width = videoPlayer.videoWidth;
    canvas.height = videoPlayer.videoHeight;

    let ctx = canvas.getContext("2d");
    if (leftRightReverse) {
      ctx.scale(-1, 1); // 左右反転
      ctx.translate(-canvas.width, 0);
    }
    if (upDownReverse) {
      ctx.scale(1, -1); // 上下反転
      ctx.translate(0, -canvas.height);
    }
    ctx.filter = filtering();
    ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        resolve(url);
      }, "image/png");
    });
  } else {
    console.log("動画が見つかりません");
    return Promise.reject("動画が見つかりません");
  }
}

function filtering() {
  return (
    "brightness(" +
    brightness +
    ") " +
    "contrast(" +
    contrast +
    ") " +
    "saturate(" +
    saturate +
    ") " +
    "grayscale(" +
    grayscale +
    ")" +
    "sepia(" +
    sepia +
    ")" +
    "hue-rotate(" +
    hueRotate +
    "deg)" +
    "invert(" +
    invert +
    ")" +
    "blur(" +
    blurred +
    "px)" +
    "opacity(" +
    opacity +
    ")"
  );
}

let observedVideoPlayer;
let observerConnected = true; // 監視が接続されているかどうかのフラグ

function isVideoPage() {
  // YouTubeの動画ページかクリップページかを判定
  return (
    window.location.pathname.includes("/watch") ||
    window.location.pathname.includes("/clip")
  );
}

function observeVideoElement() {
  //トップページで動画要素が出現してしまうため、特定のページのみで処理を走らせる
  if (!isVideoPage()) {
    console.log("動画ページではないため、処理をスキップ");
    return;
  }

  observedVideoPlayer = document.querySelector("video");
  if (observedVideoPlayer && observerConnected) {
    // 動画が再生中である場合のみ処理を実行
    if (!observedVideoPlayer.paused) {
      observedVideoPlayer.addEventListener("loadeddata", function () {
        if (videoPlayer === null) {
          videoPlayer = document.querySelector("video");
        }
        resetFilters();
        applyFilters();
        resetPlayerReverse();
        resetController();
        setClipVideo("reset");
        getAllComments();
        console.log("動画のフィルターやパラメータをリセットしました");
      });

      // 最初に動画要素が見つかったときのみ監視を停止
      if (observerConnected) {
        observer.disconnect();
        observerConnected = false; // 監視停止フラグを立てる
      }
    }
  } else {
    console.log("動画が見つかりません");
  }
}

// DOMの変更を監視
const observer = new MutationObserver((mutations) => {
  for (let mutation of mutations) {
    if (mutation.type === "childList") {
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

  let scale;
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
const shadowBottom = document.querySelector(".ytp-gradient-bottom");
const controller = document.querySelector(".ytp-chrome-bottom");
const icon = document.querySelector(".branding-img");
const container = document.querySelector(".ytp-chrome-top");
const endScreenElements = document.querySelectorAll(
  '[class^="ytp-ce-element"]'
);
function hideController() {
  if (hideControls) {
    if (shadowBottom) {
      shadowBottom.style.display = "none";
    }
    if (controller) {
      controller.style.display = "none";
    }
    if (icon) {
      icon.style.display = "none";
    }
    if (container) {
      container.style.display = "none";
    }
    endScreenElements.forEach((element) => {
      element.style.display = "none";
    });
  } else {
    if (shadowBottom) {
      shadowBottom.style.display = "block";
    }
    if (controller) {
      controller.style.display = "block";
    }
    if (icon) {
      icon.style.display = "block";
    }
    if (container) {
      container.style.display = "block";
    }
    endScreenElements.forEach((element) => {
      element.style.display = "block";
    });
  }
}

function resetController() {
  if (shadowBottom) {
    shadowBottom.style.display = "block";
  }
  if (controller) {
    controller.style.display = "block";
  }
  if (icon) {
    icon.style.display = "block";
  }
  if (container) {
    container.style.display = "block";
  }
  endScreenElements.forEach((element) => {
    element.style.display = "block";
  });
  hideControls = false;
}

let isClipMode = false;
let clipStartTime = 0;
let clipEndTime;
if (videoPlayer) {
  clipEndTime = videoPlayer.duration;
}

function setClipVideo(request) {
  if (!videoPlayer) {
    console.log("動画プレーヤーが見つかりませんでした");
    return;
  }

  if (request === "clip") {
    if (!isAdvertisement()) {
      resetClipVideo();
      applyClipVideo(clipStartTime, clipEndTime);
      seekToTimeClipVideo(clipStartTime);
      isClipMode = true;
    }
  } else {
    resetClipVideo();
    resetClipVideoTime();
    isClipMode = false;
  }
}

let playListener, timeupdateListener, seekedListener;
function applyClipVideo(startTime, endTime) {
  if (
    videoPlayer.currentTime < startTime ||
    videoPlayer.currentTime >= endTime
  ) {
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
  if (timeupdateListener)
    videoPlayer.removeEventListener("timeupdate", timeupdateListener);
  if (seekedListener) videoPlayer.removeEventListener("seeked", seekedListener);
}

function play(startTime, endTime) {
  if (
    videoPlayer.currentTime < startTime ||
    videoPlayer.currentTime >= endTime
  ) {
    videoPlayer.currentTime = startTime;
  }
}

function timeupdate(startTime, endTime) {
  if (videoPlayer.currentTime >= endTime) {
    videoPlayer.currentTime = startTime;
  }
}

function seeked(startTime, endTime) {
  if (
    videoPlayer.currentTime < startTime ||
    videoPlayer.currentTime > endTime
  ) {
    videoPlayer.currentTime = startTime;
  }
}

function resetClipVideoTime() {
  clipStartTime = 0;
  clipEndTime = videoPlayer.duration;
}

function playVideo() {
  if (videoPlayer.paused) {
    videoPlayer.play();
  } else {
    videoPlayer.pause();
  }
}

let timeParams = 5;
function forwardVideo() {
  let setTime = videoPlayer.currentTime + timeParams;
  videoPlayer.currentTime = setTime;
}

function backVideo() {
  let setTime = videoPlayer.currentTime - timeParams;
  videoPlayer.currentTime = setTime;
}

let audioParams = 0.05;
function upAudio() {
  let newVolume = Math.min(videoPlayer.volume + audioParams, 1);
  videoPlayer.volume = Math.round(newVolume * 100) / 100;
}

function downAudio() {
  let newVolume = Math.max(videoPlayer.volume - audioParams, 0);
  videoPlayer.volume = Math.round(newVolume * 100) / 100;
}

function setCurrentTime(number) {
  let time = (videoPlayer.duration / 10) * number;
  videoPlayer.currentTime = Math.round(time * 1000) / 1000;
}

function isAdvertisement() {
  const advertisement = document.querySelector(".ytp-ad-player-overlay-layout");
  if (advertisement) {
    return true;
  } else {
    return false;
  }
}

function url2videoID(url) {
  let videoID;
  if (URL.canParse(url)) {
    const url_instance = new URL(url);
    videoID = url_instance.searchParams.get("v");
    if (url.includes("?si=")) videoID = url.split("?si=")[0].split("/")[3];
  }
  return videoID;
}

function addCommentUI() {
  const ui = document.createElement("div");
  ui.id = "comment-input-ui";
  ui.innerHTML = `
    <input type="text" id="comment-text" placeholder="コメントを書く" />
    <button id="comment-send">送信</button>
  `;
  ui.style.marginTop = "12px";
  ui.style.padding = "10px";
  ui.style.background = "rgba(0, 0, 0, 0.7)";
  ui.style.color = "white";
  ui.style.borderRadius = "5px";
  ui.style.display = "flex";
  ui.style.alignItems = "center";
  ui.style.position = "relative";
  ui.style.zIndex = "9999";
  ui.style.width = "100%";

  const input = ui.querySelector("#comment-text");
  input.style.flexGrow = "1";
  input.style.padding = "8px";
  input.style.margin = "8px";
  input.style.border = "1px solid #ccc";
  input.style.borderRadius = "4px";
  input.style.backgroundColor = "#fff";
  input.style.color = "#333";

  const button = ui.querySelector("#comment-send");
  button.style.padding = "8px 16px";
  button.style.backgroundColor = "#4CAF50";
  button.style.color = "white";
  button.style.border = "none";
  button.style.borderRadius = "4px";
  button.style.cursor = "pointer";

  const target =
    document.querySelector("#below") ||
    document.querySelector("#primary-inner");
  if (target && !document.getElementById("comment-input-ui")) {
    target.prepend(ui);

    const button = ui.querySelector("#comment-send");
    if (button) {
      button.addEventListener("click", () => {
        const text = ui.querySelector("#comment-text").value;
        saveComments(text);
        if (text) {
          showFloatingComment(text);
          ui.querySelector("#comment-text").value = "";
        }
      });
    }
  }
}

const interval = setInterval(() => {
  if (videoPlayer) {
    clearInterval(interval);
    setTimeout(addCommentUI, 1000);
  }
}, 1000);

function saveComments(text) {
  const youtubeUrl = window.location.href;
  const videoID = url2videoID(youtubeUrl);
  let time = Math.round(videoPlayer.currentTime * 10) / 10 - 2;
  if (time < 0) {
    time = 0;
  }

  const formData = new FormData();
  formData.append("comment", text);
  formData.append("videoID", videoID);
  formData.append("time", time);

  const port = 50000;
  fetch(`http://localhost:${port}/comments`, {
    method: "POST",
    body: formData,
  }).then((response) => {
    console.log("保存");
  });
}

function showFloatingComment(text) {
  playerHeight = videoPlayer.getBoundingClientRect().height;
  const fontSize = 40;
  let topPosition = Math.floor(Math.random() * (playerHeight - fontSize));
  const comment = document.createElement("div");
  comment.textContent = text;
  comment.style.position = "absolute";
  comment.style.top = `${topPosition}px`;
  comment.style.whiteSpace = "nowrap";
  comment.style.fontSize = `${fontSize}px`;
  comment.style.fontWeight = "bold";
  comment.style.color = "white";
  comment.style.textShadow = "2px 2px 4px rgba(0, 0, 0, 0.7)";
  comment.style.animation = "marquee 7s linear";
  comment.addEventListener("animationend", () => {
    comment.remove();
  });

  const style = document.createElement("style");
  style.textContent = `
        @keyframes marquee {
          from { transform: translateX(100vw); }
          to { transform: translateX(-100%); }
        }`;
  document.head.appendChild(style);

  const player = videoPlayer.parentElement;
  player.appendChild(comment);

  setTimeout(() => {
    comment.remove();
  }, 10000);
}

function getAllComments() {
  const youtubeUrl = window.location.href;
  const videoID = url2videoID(youtubeUrl);
  fetch(`http://localhost:50000/comments?videoID=${videoID}`)
    .then((res) => res.json())
    .then((data) => {
      commentsTable = data;
      console.log(data);
    });
}

let lastTime = 0;
let shownComments = new Set();
setInterval(() => {
  if (!videoPlayer) {
    console.log("動画プレーヤーが見つかりません");
    return;
  }

  const currentTime = Math.round(videoPlayer.currentTime * 10) / 10;
  if (currentTime < lastTime) {
    shownComments.clear();
  }
  lastTime = currentTime;

  commentsTable.forEach(({ comment, time }) => {
    if (
      Math.abs(time - currentTime) < 0.1 &&
      !shownComments.has(time + comment)
    ) {
      showFloatingComment(comment);
      shownComments.add(time + comment);
    }
  });
}, 100);
