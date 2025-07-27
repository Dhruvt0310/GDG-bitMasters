// content-script.js
let port = chrome.runtime.connect({ name: "timeTracker" });

// Send time data to the webpage
chrome.storage.local.get('timeData', (data) => {
  window.postMessage({
    type: 'FROM_EXTENSION',
    timeData: data.timeData || {}
  }, '*');
});

// Listen for requests from the webpage
window.addEventListener('message', (event) => {
  if (event.data.type === 'REQUEST_TIME_DATA') {
    chrome.storage.local.get('timeData', (data) => {
      window.postMessage({
        type: 'FROM_EXTENSION',
        timeData: data.timeData || {}
      }, '*');
    });
  }
});

// Update webpage when time data changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.timeData) {
    window.postMessage({
      type: 'FROM_EXTENSION',
      timeData: changes.timeData.newValue || {}
    }, '*');
  }
});