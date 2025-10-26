function sendMessage(msg) {
    browser.tabs.query({active: true, currentWindow: true}, tabs => {
        browser.tabs.sendMessage(tabs[0].id, msg);
    });
}


// ===== SPEED =====

const speed = document.querySelector("#speed");
const speedLabel = document.querySelector("#speedLabel");

speed.addEventListener("input", (e) => {
    speedLabel.textContent = `Video speed: ${e.target.value}x`;
    sendMessage({
        type: "speed",
        value: e.target.value
    });
});

// ===== VIDEO LESSONS =====

const videoSkip = document.querySelector("#videoSkip");

videoSkip.addEventListener("click", (e) => {
    sendMessage({
        type: "videoSkip",
    });
});

// ===== SUMMARY QUIZ =====

const diagnosticQuiz = document.querySelector("#diagnosticQuiz");

diagnosticQuiz.addEventListener("click", (e) => {
    sendMessage({
        type: "diagnosticQuiz",
    });
});
