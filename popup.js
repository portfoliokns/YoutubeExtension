window.addEventListener('load', function() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "setting" }, (response) => {
      if (response) {
        document.getElementById("brightness").value = response.brightness;
        document.getElementById("contrast").value = response.contrast;
        document.getElementById("saturate").value = response.saturate;
        document.getElementById("grayscale").value = response.grayscale;
        document.getElementById("sepia").value = response.sepia;
        document.getElementById("hueRotate").value = response.hueRotate;
        document.getElementById("invert").value = response.invert;
        document.getElementById("blurred").value = response.blurred;
        document.getElementById("opacity").value = response.opacity;
        
        leftRightReverse = response.leftRightReverse;
        upDownReverse = response.upDownReverse;
        hideControls = response.hideControls;
        if (hideControls) {
          document.getElementById("hideControls").textContent = "コントロール表示";
        } else {
          document.getElementById("hideControls").textContent = "コントロール非表示";
        }

        let clipStartTime = response.clipStartTime;
        let startTime = seconds2time(clipStartTime)
        document.getElementById("startTimeHh").value = startTime.hhTime;
        document.getElementById("startTimeMm").value = startTime.mmTime;
        document.getElementById("startTimeSs").value = startTime.ssTime;
        document.getElementById("startTimeMs").value = startTime.msTime;

        let clipEndTime = response.clipEndTime;
        let endTime = seconds2time(clipEndTime)
        document.getElementById("endTimeHh").value = endTime.hhTime;
        document.getElementById("endTimeMm").value = endTime.mmTime;
        document.getElementById("endTimeSs").value = endTime.ssTime;
        document.getElementById("endTimeMs").value = endTime.msTime;

      }
    });
  });
});

document.getElementById("reset").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "reset" }, (response) => {
      if (response?.apply) {
        document.getElementById("startTimeHh").value = 0;
        document.getElementById("startTimeMm").value = 0;
        document.getElementById("startTimeSs").value = 0;
        document.getElementById("startTimeMs").value = 0;
        document.getElementById("endTimeHh").value = 0;
        document.getElementById("endTimeMm").value = 1;
        document.getElementById("endTimeSs").value = 0;
        document.getElementById("endTimeMs").value = 0;
        document.getElementById("brightness").value = 1
        document.getElementById("contrast").value = 1
        document.getElementById("saturate").value = 1
        document.getElementById("grayscale").value = 0
        document.getElementById("sepia").value = 0
        document.getElementById("hueRotate").value = 0
        document.getElementById("invert").value = 0
        document.getElementById("blurred").value = 0
        document.getElementById("opacity").value = 1
      } else {
        console.log('リセットに失敗')
      };
    });
  });
});

let isOpenClip = false;
document.getElementById("clip").addEventListener("click", () =>{
  const filters = document.getElementById("clipTimes");
  if (isOpenClip) {
    document.getElementById("clip").innerText = "クリップ設定を表示"
    filters.style.display = "none";
  } else {
    document.getElementById("clip").innerText = "クリップ設定を閉じる"
    filters.style.display = "block";
  }
  isOpenClip = !isOpenClip
});

document.getElementById("clipApply").addEventListener("click", () => {
  sendClipQuery()
});

document.getElementById("clipReset").addEventListener("click", () => {
  let hhStart = parseInt(document.getElementById("startTimeHh").value, 10);
  let mmStart = parseInt(document.getElementById("startTimeMm").value, 10);
  let ssStart = parseInt(document.getElementById("startTimeSs").value, 10);
  let msStart = parseInt(document.getElementById("startTimeMs").value, 10);

  let hhEnd = parseInt(document.getElementById("endTimeHh").value, 10);
  let mmEnd = parseInt(document.getElementById("endTimeMm").value, 10);
  let ssEnd = parseInt(document.getElementById("endTimeSs").value, 10);
  let msEnd = parseInt(document.getElementById("endTimeMs").value, 10);

  let startTime = time2seconds(hhStart,mmStart,ssStart,msStart)
  let endTime = time2seconds(hhEnd,mmEnd,ssEnd,msEnd)

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "clipEnd", startTime: startTime, endTime: endTime});
  });
});

let isOpenFilters = false
document.getElementById("filter").addEventListener("click", () =>{
  const filters = document.getElementById("filterSliders");
  if (isOpenFilters) {
    document.getElementById("filter").innerText = "フィルター設定を表示"
    filters.style.display = "none";
  } else {
    document.getElementById("filter").innerText = "フィルター設定を閉じる"
    filters.style.display = "block";
  }
  isOpenFilters = !isOpenFilters
});

function sendClipQuery() {
  let hhStart = parseInt(document.getElementById("startTimeHh").value, 10);
  let mmStart = parseInt(document.getElementById("startTimeMm").value, 10);
  let ssStart = parseInt(document.getElementById("startTimeSs").value, 10);
  let msStart = parseInt(document.getElementById("startTimeMs").value, 10);
  
  let hhEnd = parseInt(document.getElementById("endTimeHh").value, 10);
  let mmEnd = parseInt(document.getElementById("endTimeMm").value, 10);
  let ssEnd = parseInt(document.getElementById("endTimeSs").value, 10);
  let msEnd = parseInt(document.getElementById("endTimeMs").value, 10);
  
  let startTime = time2seconds(hhStart,mmStart,ssStart,msStart)
  let endTime = time2seconds(hhEnd,mmEnd,ssEnd,msEnd)

  if ( startTime >= endTime) {
    alert('開始時刻が終了時刻を上まってしまっています。開始時刻と終了時刻を設定し直してください。')
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "clip", startTime: startTime, endTime: endTime });
  });
}

document.getElementById("brightness").addEventListener("input", () => {
  const brightness = document.getElementById("brightness").value;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "brightness", value: brightness });
  });
});

document.getElementById("contrast").addEventListener("input", () => {
  const contrast = document.getElementById("contrast").value;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "contrast", value: contrast });
  });
});

document.getElementById("saturate").addEventListener("input", () => {
  const saturate = document.getElementById("saturate").value;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "saturate", value: saturate });
  });
});

document.getElementById("grayscale").addEventListener("input", () => {
  const grayscale = document.getElementById("grayscale").value;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "grayscale", value: grayscale });
  });
});

document.getElementById("sepia").addEventListener("input", () => {
  const sepia = document.getElementById("sepia").value;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "sepia", value: sepia });
  });
});

document.getElementById("hueRotate").addEventListener("input", () => {
  const hueRotate = document.getElementById("hueRotate").value;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "hueRotate", value: hueRotate });
  });
});

document.getElementById("invert").addEventListener("input", () => {
  const invert = document.getElementById("invert").value;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "invert", value: invert });
  });
});

document.getElementById("blurred").addEventListener("input", () => {
  const blurred = document.getElementById("blurred").value;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "blurred", value: blurred });
  });
});

document.getElementById("opacity").addEventListener("input", () => {
  const opacity = document.getElementById("opacity").value;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "opacity", value: opacity });
  });
});

let leftRightReverse = false;
document.getElementById("leftRight").addEventListener("click", () => {
  if (leftRightReverse) {
    leftRightReverse = false;
  } else {
    leftRightReverse = true;
  }
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "leftRight", value: leftRightReverse });
  });
});

let upDownReverse = false;
document.getElementById("upDown").addEventListener("click", () => {
  if (upDownReverse) {
    upDownReverse = false;
  } else {
    upDownReverse = true;
  }
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "upDown", value: upDownReverse });
  });
});

let hideControls;
document.getElementById("hideControls").addEventListener("click", () => {
  if (hideControls) {
    hideControls = false
    document.getElementById("hideControls").textContent = "コントロール非表示";
  } else {
    hideControls = true
    document.getElementById("hideControls").textContent = "コントロール表示";
  }
  
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "hideControls", value: hideControls });
  });
});

document.getElementById("camera").addEventListener("click", () => {
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
