const renderWebsiteData = (data) => {
  const listElement = document.getElementById('website-list');
  listElement.innerHTML = '';

  data.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${item.name}: ${item.time} seconds`;
    listElement.appendChild(listItem);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.sendMessage({ action: 'getWebsiteData' }, (response) => {
    renderWebsiteData(response);
  });

  const resetButton = document.getElementById('reset-btn');
  resetButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'resetData' }, (response) => {
      renderWebsiteData(response);
    });
  });
});
