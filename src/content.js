// ===== UTILS =====

function debug(info) {
    console.log("better-learn:", info);
}


// ===== API =====

async function apiFetch(auth, body) {
    debug("apiFetch");
    debug({ body })
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
    debug({ response });
    return response;
}

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[2]) : null;
}

async function getAuth() {
    debug("getAuth");
    return getCookie("auth-token");
};


// ===== SPEED =====

function setVideoSpeed(speed) {
    debug(`setVideoSpeed ${speed}`);
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
    debug(`skipping to ${seconds} seconds`);
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
    debug("skipVideoLesson");
    const url = window.location.href;

    setVideoSpeed(0);
    skipToQuestion(0);

    const path = new URL(url).pathname.split('/').filter(Boolean);
    const [moduleUniqueCode, subsectionUniqueCode, videoUniqueCode] = path.slice(-3);
    debug({ moduleUniqueCode, subsectionUniqueCode, videoUniqueCode });

    if (videoUniqueCode.slice(-5) != "video") return;

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
        "query": "query GetVideoLesson($uniqueCode: String!, $subsectionUniqueCode: String!, $moduleUniqueCode: String!, $inVideoQuestionFilter: InVideoQuestionFilter, $inVideoQuestionOrder: [InVideoQuestionOrdering]) {  videoLesson(    filter: {uniqueCode: $uniqueCode, subsectionUniqueCode: $subsectionUniqueCode, moduleUniqueCode: $moduleUniqueCode}  ) {    id    module {      id      uniqueCode      title      examBoardSubject {        subject: subjectObject {          qualification {            uniqueCode            __typename          }          __typename        }        __typename      }      __typename    }    subsection {      id      name      uniqueCode      __typename    }    wistiaId    uniqueCode    title    length    duration    extraContent    skipRecapStartTime    preVideoQuestions {      __typename      id      quizContent {        ...UnmarkedQuestion        __typename      }    }    inVideoQuizQuestions(      filter: $inVideoQuestionFilter      order: $inVideoQuestionOrder    ) {      __typename      id      triggerTime      postQuestionResumeTime      quizContent {        __typename        ...UnmarkedQuestion      }    }    __typename  }}fragment UnmarkedQuestion on QuizContent {  __typename  id  stem  quizDefinition {    __typename    questions {      ...UnmarkedQuestionPart      __typename    }  }}fragment UnmarkedQuestionPart on QuizQuestion {  __typename  ... on MultipleChoiceQuestion {    question    description    image    topImage    options {      text      image      __typename    }    __typename  }  ... on MultiMultipleChoiceQuestion {    question    description    image    topImage    options {      text      image      __typename    }    __typename  }  ... on TextQuestion {    question    description    image    topImage    beforeText    afterText    __typename  }  ... on NumericalQuestion {    question    description    image    topImage    beforeText    afterText    __typename  }  ... on MathsQuestion {    question    description    image    topImage    __typename  }  ... on MultipleInputQuestion {    questionSegments {      type: __typename      ... on MultipleInputQuestionText {        text        __typename      }      ... on MultipleInputQuestionBlank {        fieldIndex        __typename      }    }    description    image    topImage    __typename  }  ... on ChemistryQuestion {    question    description    image    topImage    __typename  }  ... on DropdownQuestion {    question    description    image    topImage    dropdownOptions    __typename  }  ... on DrawQuestion {    question    description    image    topImage    drawOn    __typename  }  ... on EngageQuestion {    question    description    image    topImage    __typename  }}"
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
    setVideoSpeed(1);
}


// ===== LISTENERS =====

debug("hello world!");

browser.runtime.onMessage.addListener((msg) => {
    debug(msg);
    switch (msg.type) {
        case "speed":
            setVideoSpeed(msg.value);
            break;
        case "videoSkip":
            skipVideoLesson()
            break;
    }
});

// ===== FULLSCREEN =====

function injectInline(code) {
    debug("injectInline");
    const script = document.createElement('script');
    script.textContent = code;
    (document.head || document.documentElement).appendChild(script);
    script.remove();
    debug("injected script");
}

injectInline(`

// ===== PATCHES =====

function patchPromises() {
    console.log("better-learn: patchPromises");

    const fakePromise = Promise.resolve();

    Element.prototype.requestFullscreen = function() {
        return fakePromise;
    };

    Document.prototype.requestFullscreen = function() {
        return fakePromise;
    };
}

function patchProperties() {
    console.log("# patchProperties");

    Object.defineProperty(document, "fullscreenElement", {
        get: () => document.documentElement
    });

    Object.defineProperty(document, "fullscreenEnabled", {
        get: () => true
    });
}


// ===== APPLICATION =====

console.log("better-learn: hello bigger world!");
patchPromises();

`);
