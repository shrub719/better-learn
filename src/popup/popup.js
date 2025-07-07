function sendMessage(msg) {
    browser.tabs.query({active: true, currentWindow: true}, tabs => {
        browser.tabs.sendMessage(tabs[0].id, msg);
    });
}

// ===== COMPLETE =====

complete = document.querySelector("#complete");

complete.addEventListener("click", (e) => {
    sendMessage({
        type: "complete"
    });
});

// ===== SPEED =====

speed = document.querySelector("#speed");
speedLabel = document.querySelector("#speedLabel");

speed.addEventListener("input", (e) => {
    speedLabel.textContent = `Video speed: ${e.target.value}x`;
    sendMessage({
        type: "speed",
        value: e.target.value
    });
});

// ===== VIDEO LESSONS ======

videoSkip = document.querySelector("#videoSkip");

videoSkip.addEventListener("input", (e) => {
    sendMessage({
        type: "videoSkip",
        value: e.target.checked
    });
});
