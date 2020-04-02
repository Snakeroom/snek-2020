chrome.runtime.onInstalled.addListener(() => {
    console.log("WE ARE SNEK.");
});
chrome.runtime.onMessage.addListener(message => {
    switch (message) {
        case "open-snakeroom":
            chrome.tabs.create({ url: "https://snakeroom.org/sneknet" });
            break;
    }
});
