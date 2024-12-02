window.addEventListener('load', function() {
  const currentPath = window.location.pathname;

  if (currentPath === '/clip_redirect') {
    const url = new URLSearchParams(window.location.search);
    const videoID = url.get('videoID');
    const startTime = url.get('start');
    const endTime = url.get('end');

    chrome.storage.local.set({ clipStartTime: startTime });
    chrome.storage.local.set({ clipEndTime: endTime });
    chrome.storage.local.set({ isClipMode: true });

    setTimeout(function() {
      window.location.href = "https://www.youtube.com/watch?v=" + videoID;
    },100);
  }
});