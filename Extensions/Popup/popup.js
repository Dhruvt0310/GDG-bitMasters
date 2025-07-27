document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["totalTimeSpent", "currentVideoData"], (data) => {
        const timeSpent = Math.round(data.totalTimeSpent || 0);
        document.getElementById("time-spent").textContent = `Time Spent: ${timeSpent}s`;

        if (data.currentVideoData) {
            document.getElementById("video-title").textContent = `Title: ${data.currentVideoData.title}`;
            document.getElementById("engagement").textContent = `Likes: ${data.currentVideoData.likes}`;
        }
    });
});