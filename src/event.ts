chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ color: "#3aa757" }, () => {
        console.log("WE ARE SNEK.");
    });
});
