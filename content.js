
chrome.runtime.sendMessage({ action: 'updateTab' });

window.addEventListener('hashchange', () => {
  chrome.runtime.sendMessage({ action: 'updateTab' });
});

window.addEventListener('popstate', () => {
  chrome.runtime.sendMessage({ action: 'updateTab' });
});
