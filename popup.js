const resetButton = document.getElementById("resetButton");
const clipOpenButton = document.getElementById("clipOpenButton");
const clipSettings = document.getElementById("clipSettings");
const clipSaveButton = document.getElementById("clipSaveButton");
const clipName = document.getElementById("clipName");
const clipApplyButton = document.getElementById("clipApplyButton");
const clipResetButton = document.getElementById("clipResetButton");
const startTimeLabel = document.getElementById("startTimeLabel");
const endTimeLabel = document.getElementById("endTimeLabel");
const startTimeHh = document.getElementById("startTimeHh");
const startTimeMm = document.getElementById("startTimeMm");
const startTimeSs = document.getElementById("startTimeSs");
const startTimeMs = document.getElementById("startTimeMs");
const endTimeHh = document.getElementById("endTimeHh");
const endTimeMm = document.getElementById("endTimeMm");
const endTimeSs = document.getElementById("endTimeSs");
const endTimeMs = document.getElementById("endTimeMs");
const filterButton = document.getElementById("filterButton");
const filterSliders = document.getElementById("filterSliders");
const brightness = document.getElementById("brightness");
const contrast = document.getElementById("contrast");
const saturate = document.getElementById("saturate");
const grayscale = document.getElementById("grayscale");
const sepia = document.getElementById("sepia");
const hueRotate = document.getElementById("hueRotate");
const invert = document.getElementById("invert");
const blurred = document.getElementById("blurred");
const opacity = document.getElementById("opacity");
const leftRight = document.getElementById("leftRight");
const upDown = document.getElementById("upDown");
const hideControls = document.getElementById("hideControls");
const cameraButton = document.getElementById("cameraButton");

window.addEventListener('load', function() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "getPlayerParameters" }, (response) => {

      if (response) {
        brightness.value = response.brightness;
        contrast.value = response.contrast;
        saturate.value = response.saturate;
        grayscale.value = response.grayscale;
        sepia.value = response.sepia;
        hueRotate.value = response.hueRotate;
        invert.value = response.invert;
        blurred.value = response.blurred;
        opacity.value = response.opacity;

        if (response.leftRightReverse) { leftRight.checked = true; }
        if (response.upDownReverse) { upDown.checked = true; }
        if (response.hideControls) { hideControls.checked = true; }

        let isClipMode = response.isClipMode
        if (isClipMode) {
          buttonEnable();
        }

        clipName.value = JSON.parse(localStorage.getItem('clipName'));

        let clipStartTime = response.clipStartTime;
        let startTime = seconds2time(clipStartTime);
        setStartTimes(startTime);

        let clipEndTime = response.clipEndTime;
        let endTime = seconds2time(clipEndTime);
        setEndTimes(endTime);
      }

    });
  });
});

resetButton.addEventListener("click", (event) => {
  event.preventDefault();

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "reset" }, (response) => {
      if (response) {
        let clipStartTime = response.clipStartTime;
        let startTime = seconds2time(clipStartTime);
        setStartTimes(startTime);

        let clipEndTime = response.clipEndTime;
        let endTime = seconds2time(clipEndTime);
        setEndTimes(endTime);

        brightness.value = response.brightness;
        contrast.value = response.contrast;
        saturate.value = response.saturate;
        grayscale.value = response.grayscale;
        sepia.value = response.sepia;
        hueRotate.value = response.hueRotate;
        invert.value = response.invert;
        blurred.value = response.blurred;
        opacity.value = response.opacity;
        leftRight.checked = response.leftRightReverse;
        upDown.checked = response.upDownReverse;
        hideControls.checked = response.hideControls;
        clipName.value = "";

        buttonDisabled();
      } else {
        console.log('リセットに失敗')
      };
    });
  });
});

let isOpenClip = false;
clipOpenButton.addEventListener("click", (event) =>{
  event.preventDefault();

  if (isOpenClip) {
    clipOpenButton.value = "擬似クリップ設定を表示"
    clipSettings.style.display = "none";
  } else {
    clipOpenButton.value = "擬似クリップ設定を閉じる"
    clipSettings.style.display = "block";
  }
  isOpenClip = !isOpenClip
});

clipName.addEventListener("blur", () => {
  localStorage.setItem('clipName', JSON.stringify(clipName.value));
})

clipSaveButton.addEventListener("click", (event) => {
  event.preventDefault();

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "clipSave"}, (response) => {
      if (response?.url) {
        let title = clipName.value;
        if (!title) { title = tabs[0].title; }

        let youtubeUrl = tabs[0].url;
        let videoID = url2videoID(youtubeUrl);
        if (!videoID) {
          alert('該当するvideoIDがありませんでした。URLにvideoIDが含まれるかを確認してください。')
          return;
        }

        let hhStart = parseInt(startTimeHh.value, 10);
        let mmStart = parseInt(startTimeMm.value, 10);
        let ssStart = parseInt(startTimeSs.value, 10);
        let msStart = parseInt(startTimeMs.value, 10);
        let hhEnd = parseInt(endTimeHh.value, 10);
        let mmEnd = parseInt(endTimeMm.value, 10);
        let ssEnd = parseInt(endTimeSs.value, 10);
        let msEnd = parseInt(endTimeMs.value, 10);

        let startTime = time2seconds(hhStart,mmStart,ssStart,msStart);
        let endTime = time2seconds(hhEnd,mmEnd,ssEnd,msEnd);
        let maxSeconds = response.maxSeconds

        if (endTime > maxSeconds) {
          alert('プレーヤーの終了時間を超えた時刻を登録することはできません。')
          return;
        }

        fetch(response.url)
          .then((res) => res.blob())
          .then((blob) => {
            // フォームデータを作成
            const formData = new FormData();
            formData.append("title", title);
            formData.append("videoID", videoID);
            formData.append("start_time", startTime);
            formData.append("end_time", endTime);
            formData.append("image", blob, "image.png");

            const port = 50000;
            fetch(`http://localhost:${port}/images`, {
              method: "POST",
              body: formData,
              }
            )
            .then((response) => response.json())
            .then((data) => alert("成功: " + JSON.stringify(data)))
            .catch((error) => alert("エラー：",  + JSON.stringify(error)))
        })
      }
    });
  });

});

startTimeLabel.addEventListener("click", (event) => {
  event.preventDefault();
  getNowTime((startTime) => {
    if (startTime) {
      setStartTimes(startTime)
    } else {
      console.log("時刻の取得に失敗しました");
    }
  });
});

endTimeLabel.addEventListener("click", (event) => {
  event.preventDefault();
  getNowTime((endTime) => {
    if (endTime) {
      setEndTimes(endTime)
    } else {
      console.log("時刻の取得に失敗しました");
    }
  });
});

clipApplyButton.addEventListener("click", (event) => {
  event.preventDefault();

  sendClipApply();
  buttonEnable();
});

clipResetButton.addEventListener("click", (event) => {
  event.preventDefault();
  
  sendClipRelease();
  buttonDisabled();
});

let isOpenFilters = false;
filterButton.addEventListener("click", (event) =>{
  event.preventDefault();

  if (isOpenFilters) {
    filterButton.value = "フィルター設定を表示"
    filterSliders.style.display = "none";
  } else {
    filterButton.value = "フィルター設定を閉じる"
    filterSliders.style.display = "block";
  }
  isOpenFilters = !isOpenFilters;
});

brightness.addEventListener("input", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "brightness", value: brightness.value });
  });
});

contrast.addEventListener("input", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "contrast", value: contrast.value });
  });
});

saturate.addEventListener("input", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "saturate", value: saturate.value });
  });
});

grayscale.addEventListener("input", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "grayscale", value: grayscale.value });
  });
});

sepia.addEventListener("input", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "sepia", value: sepia.value });
  });
});

document.getElementById("hueRotate").addEventListener("input", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "hueRotate", value: hueRotate.value });
  });
});

invert.addEventListener("input", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "invert", value: invert.value });
  });
});

blurred.addEventListener("input", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "blurred", value: blurred.value });
  });
});

opacity.addEventListener("input", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "opacity", value: opacity.value });
  });
});

leftRight.addEventListener("change", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "leftRight" });
  });
});

upDown.addEventListener("change", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "upDown" });
  });
});

hideControls.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "hideControls" });
  });

});

cameraButton.addEventListener("click", (event) => {
  event.preventDefault();

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "camera"}, (response) => {
      if (response?.url) {
        const a = document.createElement('a');
        a.href = response.url;
        a.download = tabs[0].title + '.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(response.url);
      }
    });
  });
});

document.addEventListener('keydown', function(event) {
  const activeElement = document.activeElement;
  if (activeElement.tagName === 'INPUT') {
    return;
  }

  let pressKey = event.key;
  let keyList = [' ', 'l', 'j', 'i', 'k', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  if (keyList.includes(pressKey)) {
    event.preventDefault();
  }
  
  let command = "";
  let number = "";
  switch (pressKey) {
    case ' ':
      command = "playStop"
      break;
    case 'l':
      command = "forward"
      break;
    case 'j':
      command = "back"
      break;
    case 'i':
      command = "upAudio"
      break;
    case 'k':
      command = "downAudio"
      break;
    case 'ArrowRight':
      command = "forward"
      break;
    case 'ArrowLeft':
      command = "back"
      break;
    case 'ArrowUp':
      command = "upAudio"
      break;
    case 'ArrowDown':
      command = "downAudio"
      break;
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
    case '0':
      command = "setNumberTime"
      number = pressKey;
      console.log(command, number)
      break;
    default:
      return;
  }

  if (command) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { command: command, number: number });
    });
  }
});

function sendClipApply() {
  let hhStart = parseInt(startTimeHh.value, 10);
  let mmStart = parseInt(startTimeMm.value, 10);
  let ssStart = parseInt(startTimeSs.value, 10);
  let msStart = parseInt(startTimeMs.value, 10);
  let hhEnd = parseInt(endTimeHh.value, 10);
  let mmEnd = parseInt(endTimeMm.value, 10);
  let ssEnd = parseInt(endTimeSs.value, 10);
  let msEnd = parseInt(endTimeMs.value, 10);

  if (
    hhStart < 0 || mmStart < 0 || ssStart < 0 || msStart < 0 ||
    hhEnd < 0 || mmEnd < 0 || ssEnd < 0 || msEnd < 0 ||
    Number.isNaN(hhStart) || Number.isNaN(mmStart) || Number.isNaN(ssStart) || Number.isNaN(msStart) ||
    Number.isNaN(hhEnd) || Number.isNaN(mmEnd) || Number.isNaN(ssEnd) || Number.isNaN(msEnd)
  ) {
    alert('開始時刻または終了時刻に正の数値を入力してください。');
    return;
  }

  let startTime = time2seconds(hhStart,mmStart,ssStart,msStart)
  let endTime = time2seconds(hhEnd,mmEnd,ssEnd,msEnd)

  if (startTime >= endTime) {
    alert('開始時刻が終了時刻を上まってしまっています。開始時刻と終了時刻を設定し直してください。')
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "clip", startTime: startTime, endTime: endTime });
  });
}

function sendClipRelease() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "clipEnd" });
  });
}


function time2seconds(hhTime, mmTime, ssTime, msTime) {
  let seconds = 0;
  seconds += hhTime * 3600; // 時間を秒に変換
  seconds += mmTime * 60;   // 分を秒に変換
  seconds += ssTime;        // 秒
  seconds += msTime / 1000;  // ミリ秒

  return seconds
}

function seconds2time(totalSeconds) {
  // 時間を計算
  let hhTime = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;

  // 分を計算
  let mmTime = Math.floor(totalSeconds / 60);
  totalSeconds %= 60;

  // 秒とミリ秒を計算
  let ssTime = Math.floor(totalSeconds);
  let msTime = Math.round((totalSeconds - ssTime) * 1000);
  
  return {
    hhTime: hhTime,
    mmTime: mmTime,
    ssTime: ssTime,
    msTime: msTime
  };
}

function getNowTime(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "getNowSeconds" }, (response) => {
      if (response?.seconds) {
        let seconds = Math.floor(response.seconds);
        let time = seconds2time(seconds);
        callback(time);
      } else {
        console.log('時刻の取得に失敗しました')
        callback(null);
      }
    })
  });
}

function setStartTimes(startTime) {
  startTimeHh.value = startTime.hhTime;
  startTimeMm.value = startTime.mmTime;
  startTimeSs.value = startTime.ssTime;
  startTimeMs.value = startTime.msTime;
}

function setEndTimes(endTime) {
  endTimeHh.value = endTime.hhTime;
  endTimeMm.value = endTime.mmTime;
  endTimeSs.value = endTime.ssTime;
  endTimeMs.value = endTime.msTime;
}

function url2videoID(url){
  let videoID;
  if (URL.canParse(url)) {
    const url_instance = new URL(url)
    videoID = url_instance.searchParams.get("v");
    if (url.includes('?si=')) videoID = url.split("?si=")[0].split("/")[3];
  }
  return videoID;
}

function buttonEnable() {
  clipResetButton.disabled = false;
  clipResetButton.classList.remove("disabled");
}

function buttonDisabled() {
  clipResetButton.disabled = true;
  clipResetButton.classList.add("disabled");
}