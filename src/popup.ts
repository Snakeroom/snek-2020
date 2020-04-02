document.getElementById("open-imposter")?.addEventListener("click", () => {
    chrome.tabs.create({ url: "https://new.reddit.com/r/Imposter" });
});
