let websiteData = {};

function getWebsiteName(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (error) {
    console.error('Error processing URL:', url, error);
    return 'Invalid URL';
  }
}


function updateWebsiteData(tabId, url) {
  const currentTimestamp = Date.now();
  const websiteName = getWebsiteName(url);

  if (!websiteData[tabId]) {
    websiteData[tabId] = {
      name: websiteName,
      time: 0,
      lastUpdate: currentTimestamp,
    };
  } else {
    const lastUpdate = websiteData[tabId].lastUpdate;
    websiteData[tabId].time += Math.floor((currentTimestamp - lastUpdate) / 1000);
    websiteData[tabId].lastUpdate = currentTimestamp;
  }
}

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    updateWebsiteData(tab.id, tab.url);
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    updateWebsiteData(tab.id, tab.url);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getWebsiteData') {
    const websiteDataArray = Object.values(websiteData);
    sendResponse(websiteDataArray);
  } else if (request.action === 'resetData') {
    websiteData = {};
    sendResponse([]);
  } else if (request.action === 'updateTab') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      updateWebsiteData(currentTab.id, currentTab.url);
    });
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  delete websiteData[tabId];
});
