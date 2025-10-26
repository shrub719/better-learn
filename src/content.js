// ===== COMPLETE =====

async function apiFetch(auth, body) {
    console.log("# apiFetch");
    console.log(body);
    let response = await fetch("https://web.uplearn.co.uk/api/", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${auth}`
        },
        credentials: "include",
        body: JSON.stringify(body)
    });
    response = await response.json();
    console.log(response); 
    return response;
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
}

async function getAuth() {
    console.log("# getAuth");
    return getCookie("auth-token");
};

// ===== SPEED =====

function setVideoSpeed(speed) {
    console.log(`# setVideoSpeed ${speed}`);

    document.querySelector("video").playbackRate = speed;
}

// ===== VIDEO LESSONS =====

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForQuestion() {
    while (true) { 
        const video = document.querySelector("media-controller");
        const { display } = window.getComputedStyle(video, null);
        if (display !== "none") {
            break;
        }
        await sleep(500);
    }
}

function skipToQuestion(seconds) {
    console.log(`# skipping to ${seconds}`);
    document.querySelector("video").currentTime = seconds;
}

function durationToSeconds(isoDuration) {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/;
    const match = isoDuration.match(regex);
  
    if (!match) return 0;
  
    const hours = parseFloat(match[1] || 0);
    const minutes = parseFloat(match[2] || 0);
    const seconds = parseFloat(match[3] || 0);
  
    return hours * 3600 + minutes * 60 + seconds;
  }

async function skipVideoLesson() {
    console.log("# skipVideoLesson");
    const url = window.location.href;

    if (url.slice(-5) != "video") return;
    
    setVideoSpeed(0);
    skipToQuestion(0);

    const path = new URL(url).pathname.split('/').filter(Boolean);
    const [moduleUniqueCode, subsectionUniqueCode, videoUniqueCode] = path.slice(-3);
    console.log(`# ${moduleUniqueCode}, ${subsectionUniqueCode}, ${videoUniqueCode}`);
    const getLessonBody = {
        "operationName": "GetVideoLesson",
        "variables": {
            "moduleUniqueCode": moduleUniqueCode,
            "subsectionUniqueCode": subsectionUniqueCode,
            "uniqueCode": videoUniqueCode,
            "inVideoQuestionOrder": [
                {
                    "field": "TRIGGER_TIME",
                    "direction": "ASC"
                }
            ]
        },
        "query": "query GetVideoLesson($uniqueCode: String!, $subsectionUniqueCode: String!, $moduleUniqueCode: String!, $inVideoQuestionFilter: InVideoQuestionFilter, $inVideoQuestionOrder: [InVideoQuestionOrdering]) {\n  videoLesson(\n    filter: {uniqueCode: $uniqueCode, subsectionUniqueCode: $subsectionUniqueCode, moduleUniqueCode: $moduleUniqueCode}\n  ) {\n    id\n    module {\n      id\n      uniqueCode\n      title\n      examBoardSubject {\n        subject: subjectObject {\n          qualification {\n            uniqueCode\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    subsection {\n      id\n      name\n      uniqueCode\n      __typename\n    }\n    wistiaId\n    uniqueCode\n    title\n    length\n    duration\n    extraContent\n    skipRecapStartTime\n    preVideoQuestions {\n      __typename\n      id\n      quizContent {\n        ...UnmarkedQuestion\n        __typename\n      }\n    }\n    inVideoQuizQuestions(\n      filter: $inVideoQuestionFilter\n      order: $inVideoQuestionOrder\n    ) {\n      __typename\n      id\n      triggerTime\n      postQuestionResumeTime\n      quizContent {\n        __typename\n        ...UnmarkedQuestion\n      }\n    }\n    __typename\n  }\n}\n\nfragment UnmarkedQuestion on QuizContent {\n  __typename\n  id\n  stem\n  quizDefinition {\n    __typename\n    questions {\n      ...UnmarkedQuestionPart\n      __typename\n    }\n  }\n}\n\nfragment UnmarkedQuestionPart on QuizQuestion {\n  __typename\n  ... on MultipleChoiceQuestion {\n    question\n    description\n    image\n    topImage\n    options {\n      text\n      image\n      __typename\n    }\n    __typename\n  }\n  ... on MultiMultipleChoiceQuestion {\n    question\n    description\n    image\n    topImage\n    options {\n      text\n      image\n      __typename\n    }\n    __typename\n  }\n  ... on TextQuestion {\n    question\n    description\n    image\n    topImage\n    beforeText\n    afterText\n    __typename\n  }\n  ... on NumericalQuestion {\n    question\n    description\n    image\n    topImage\n    beforeText\n    afterText\n    __typename\n  }\n  ... on MathsQuestion {\n    question\n    description\n    image\n    topImage\n    __typename\n  }\n  ... on MultipleInputQuestion {\n    questionSegments {\n      type: __typename\n      ... on MultipleInputQuestionText {\n        text\n        __typename\n      }\n      ... on MultipleInputQuestionBlank {\n        fieldIndex\n        __typename\n      }\n    }\n    description\n    image\n    topImage\n    __typename\n  }\n  ... on ChemistryQuestion {\n    question\n    description\n    image\n    topImage\n    __typename\n  }\n  ... on DropdownQuestion {\n    question\n    description\n    image\n    topImage\n    dropdownOptions\n    __typename\n  }\n  ... on DrawQuestion {\n    question\n    description\n    image\n    topImage\n    drawOn\n    __typename\n  }\n  ... on OpenEndedQuestion {\n    question\n    description\n    image\n    topImage\n    __typename\n  }\n}"
    };
    const auth = await getAuth();
    const lesson = await apiFetch(auth, getLessonBody);
    const questions = lesson.data.videoLesson.inVideoQuizQuestions;
    const lessonEnd = durationToSeconds(lesson.data.videoLesson.duration);

    for (const question of questions) {
        timestamp = durationToSeconds(question.triggerTime);
        skipToQuestion(timestamp);
        await sleep(2000);
        await waitForQuestion();
    }

    skipToQuestion(lessonEnd);
}

// ===== SUMMARY QUIZ =====

function diagnosticQuiz() {
    console.log("# diagnosticQuiz");
    const url = window.location.href;
    const path = new URL(url).pathname.split('/').filter(Boolean);
    const [check, moduleUniqueCode, subsectionUniqueCode] = path.slice(-3);

    if (check != "learn") return;

    window.location.href = url + "/diagnostic-quiz";
}

// ===== LISTENERS =====

console.log("# hey im here!")

browser.runtime.onMessage.addListener((msg) => {
    console.log(msg);
    switch (msg.type) {
        case "speed":
            setVideoSpeed(msg.value);
            break;
        case "videoSkip":
            checkVideoLesson();
            break;
        case "diagnosticQuiz":
            diagnosticQuiz();
    }
});
