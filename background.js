chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "captureMe",
    title: "Capture Me",
    contexts: ["all"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "captureMe") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['html2canvas.min.js']
    }, () => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: captureEntirePage
      });
    });
  }
});

function captureEntirePage() {
  window.html2canvas(document.body).then(canvas => {
    canvas.toBlob(blob => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        // Get current year and second
        const now = new Date();
        const year = now.getFullYear();
        const second = now.getSeconds();
        a.download = `Screenshot_${year}_${second}.png`;

        a.click();
        URL.revokeObjectURL(url);
      } else {
        console.error('Blob creation failed.');
      }
    }, 'image/png');
  }).catch(error => {
    console.error('html2canvas error:', error);
  });
}

