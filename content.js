// Function to filter YouTube recommendations
function filterRecommendations(allowedChannels) {
    const sections = [
        '#related', // Watch page
        '#items',   // Search results page
        'ytd-rich-grid-renderer', // Homepage
        'ytd-vertical-list-renderer', // Other possible sections
    ];

    sections.forEach(sectionSelector => {
        const recommendedSection = document.querySelector(sectionSelector);
        if (!recommendedSection)
            return;

        const videos = recommendedSection.querySelectorAll('ytd-video-renderer, ytd-grid-video-renderer, ytd-rich-item-renderer');
        videos.forEach(video => {
            const channelNameElement = video.querySelector('ytd-channel-name a');
            if (channelNameElement) {
                const channelName = channelNameElement.textContent.trim();

                if (!allowedChannels.includes(channelName)) {
                    video.style.display = 'none';
                    console.log(`Hiding video from channel: ${channelName}`);
                }
            }
        });
    });
}

// Function to check the current video channel
function checkCurrentVideoChannel(allowedChannels) {
    const videoOwnerElement = document.querySelector('ytd-video-owner-renderer #channel-name a');
    if (!videoOwnerElement)
        return;

    const videoChannelName = videoOwnerElement.textContent.trim();
    if (!allowedChannels.includes(videoChannelName)) {
        const videoPlayer = document.querySelector('.html5-video-player');
        if (videoPlayer) {
            videoPlayer.style.display = 'none';
            console.log(`Hiding current video from channel: ${videoChannelName}`);
        }
    }
}

// Fetch allowed channels and the extension enabled state from storage and filter recommendations and current video
chrome.storage.sync.get(['allowedChannels', 'isExtensionEnabled'], function(data) {
    const allowedChannels = data.allowedChannels || [];
    const isExtensionEnabled = data.isExtensionEnabled !== undefined ? data.isExtensionEnabled : true;

    if (isExtensionEnabled) {
        console.log('Extension is enabled.');
        filterRecommendations(allowedChannels);
        checkCurrentVideoChannel(allowedChannels);
    } else {
        console.log('Extension is disabled.');
    }
});

// Observe changes to the recommended sections and the current video
const observer = new MutationObserver(function() {
    chrome.storage.sync.get(['allowedChannels', 'isExtensionEnabled'], function(data) {
        const allowedChannels = data.allowedChannels || [];
        const isExtensionEnabled = data.isExtensionEnabled !== undefined ? data.isExtensionEnabled : true;

        if (isExtensionEnabled) {
            console.log('Extension is enabled (observer).');
            filterRecommendations(allowedChannels);
            checkCurrentVideoChannel(allowedChannels);
        } else {
            console.log('Extension is disabled (observer).');
        }
    });
});

const config = { childList: true, subtree: true };
const targetNode = document.querySelector('body');
if (targetNode) {
    observer.observe(targetNode, config);
    console.log('Observer attached to body.');
} else {
    console.log('Body element not found.');
}

// Initial filtering and current video check
document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.sync.get(['allowedChannels', 'isExtensionEnabled'], function(data) {
        const allowedChannels = data.allowedChannels || [];
        const isExtensionEnabled = data.isExtensionEnabled !== undefined ? data.isExtensionEnabled : true;

        if (isExtensionEnabled) {
            console.log('Extension is enabled (DOMContentLoaded).');
            filterRecommendations(allowedChannels);
            checkCurrentVideoChannel(allowedChannels);
        } else {
            console.log('Extension is disabled (DOMContentLoaded).');
        }
    });
});
