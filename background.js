chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ allowedChannels: [], isExtensionEnabled: true });
  console.log('YouTube Channel Filter extension installed.');
});
