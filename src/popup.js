document.addEventListener('DOMContentLoaded', () => {
    const channelInput = document.getElementById('channelInput');
    const addChannelButton = document.getElementById('addChannel');
    const channelList = document.getElementById('channelList');
    const extensionToggle = document.getElementById('extensionToggle');

    // Load settings from storage
    chrome.storage.sync.get(['allowedChannels', 'isExtensionEnabled'], (data) => {
        const allowedChannels = data.allowedChannels || [];
        allowedChannels.forEach(channel => {
            addChannelToUI(channel);
        });

        const isExtensionEnabled = data.isExtensionEnabled !== undefined ? data.isExtensionEnabled : true;
        extensionToggle.checked = isExtensionEnabled;
    });

    // Add channel button click event
    addChannelButton.addEventListener('click', () => {
        const channelName = channelInput.value.trim();
        if (channelName) {
            chrome.storage.sync.get('allowedChannels', (data) => {
                const allowedChannels = data.allowedChannels || [];
                if (!allowedChannels.includes(channelName)) {
                    allowedChannels.push(channelName);
                    chrome.storage.sync.set({ allowedChannels }, () => {
                        addChannelToUI(channelName);
                        channelInput.value = '';
                    });
                }
            });
        }
    });

    // Extension toggle change event
    extensionToggle.addEventListener('change', () => {
        const isExtensionEnabled = extensionToggle.checked;
        chrome.storage.sync.set({ isExtensionEnabled });
    });

    // Function to add channel to the UI
    function addChannelToUI(channelName) {
        const li = document.createElement('li');
        li.textContent = channelName;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => {
            chrome.storage.sync.get('allowedChannels', (data) => {
                const allowedChannels = data.allowedChannels || [];
                const index = allowedChannels.indexOf(channelName);
                if (index > -1) {
                    allowedChannels.splice(index, 1);
                    chrome.storage.sync.set({ allowedChannels }, () => {
                        channelList.removeChild(li);
                    });
                }
            });
        });
        li.appendChild(removeButton);
        channelList.appendChild(li);
    }
});
