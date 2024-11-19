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
      }
    });
  });
});

document.getElementById("reset").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "reset" }, (response) => {
      if (response?.apply) {
        document.getElementById("brightness").value = 1
        document.getElementById("contrast").value = 1
        document.getElementById("saturate").value = 1
        document.getElementById("grayscale").value = 0
        document.getElementById("sepia").value = 0
        document.getElementById("hueRotate").value = 0
        document.getElementById("invert").value = 0
        document.getElementById("blurred").value = 0
        document.getElementById("opacity").value = 1
        // document.getElementById("rotation").value = 0
      } else {
        console.log('リセットに失敗')
      };
    });
  });
});

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

