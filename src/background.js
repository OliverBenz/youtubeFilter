chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ 
    allowedChannels: [
      "Lectures in Physics",
      "Qilin Xue",
      "Aleph 0",
      "Veritasium",
      "Stuff Made Here",
      "Michael Penn",
      "Mathemaniac"
    ],
    isExtensionEnabled: true
  });
  console.log('YouTube Channel Filter extension installed.');
});
