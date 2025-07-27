const TRACKING_SITES = [
    'youtube.com',
    'facebook.com',
    'instagram.com'
  ];
  
  let activeTabData = {
    url: null,
    startTime: null
  };
  
  chrome.tabs.onActivated.addListener(async (activeInfo) => {
    try {
      const tab = await chrome.tabs.get(activeInfo.tabId);
      if (tab.url) {
        handleTabChange(tab.url);
      }
    } catch (error) {
      console.error("Failed to get tab info:", error);
    }
  });
  
  
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
      handleTabChange(changeInfo.url);
    }
  });
  
  function handleTabChange(newUrl) {
    console.log("Switching to:", newUrl);
  
    // Save previous tab data
    if (activeTabData.url && activeTabData.startTime) {
      const timeSpent = Date.now() - activeTabData.startTime;
      console.log(`Time spent on ${activeTabData.url}: ${timeSpent}ms`);
      saveTimeData(activeTabData.url, timeSpent);
    }
  
    // Track new tab if it’s a tracked site
    const trackedSite = TRACKING_SITES.find(site => newUrl?.includes(site));
    if (trackedSite) {
      activeTabData = {
        url: trackedSite,
        startTime: Date.now()
      };
      console.log(`Started tracking ${trackedSite}`);
    } else {
      activeTabData = { url: null, startTime: null };
    }
  }
  
  
  async function saveTimeData(site, timeSpent) {
    const date = new Date().toISOString().split('T')[0];
  
    // Fetch stored data
    let storedData = await chrome.storage.local.get('timeData');
  
    // Ensure 'timeData' exists
    if (!storedData.timeData) {
      storedData.timeData = {};
    }
  
    // Ensure today's date entry exists
    if (!storedData.timeData[date]) {
      storedData.timeData[date] = {};
    }
  
    // Ensure site's time tracking exists
    if (!storedData.timeData[date][site]) {
      storedData.timeData[date][site] = 0;
    }
  
    // Update time spent
    storedData.timeData[date][site] += timeSpent;
  
    // Save updated data back to storage
    await chrome.storage.local.set({ timeData: storedData.timeData });
  
    // Send message to frontend safely
    chrome.runtime.sendMessage({ type: "UPDATE_TIME_DATA", timeData: storedData.timeData });
  }
  
  