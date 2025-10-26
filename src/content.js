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

async function getSubsections(auth) {
    console.log("# getSubsections");
    let subsections = {};

    const url = window.location.href;
    const path = new URL(url).pathname.split('/').filter(Boolean);
    const [moduleUniqueCode, subsectionUniqueCode] = path.slice(-2);
    const body = {
        "operationName": "GetSubsectionOverviewData",
        "variables": {
            "moduleUniqueCode": moduleUniqueCode,
            "subsectionUniqueCode": subsectionUniqueCode,
            "categoryUniqueCodeIn": []
        },
        "query": "query GetSubsectionOverviewData($subsectionUniqueCode: String!, $moduleUniqueCode: String!, $categoryUniqueCodeIn: [String!]) {\n  subsection(\n    filter: {uniqueCode: $subsectionUniqueCode, moduleUniqueCode: $moduleUniqueCode, categoryUniqueCodeIn: $categoryUniqueCodeIn}\n  ) {\n    id\n    name\n    uniqueCode\n    icon\n    locked\n    currentUserScore\n    isDiagnosticQuizEnabled\n    subsectionQuizSession {\n      id\n      currentStep\n      __typename\n    }\n    summary {\n      id\n      released\n      wistiaVideoDuration\n      __typename\n    }\n    subsectionNumber\n    subsectionQuizAvailable\n    preActivitiesNotice\n    postActivitiesNotice\n    module {\n      id\n      title\n      subtitle\n      uniqueCode\n      releaseType\n      schoolYear\n      currentUserEnrolment {\n        id\n        isTrial\n        isActive\n        enrolmentPlan\n        __typename\n      }\n      examBoardSubject {\n        id\n        board\n        subject\n        boardName\n        boardObject {\n          id\n          __typename\n        }\n        subjectName\n        subjectObject {\n          id\n          qualification {\n            uniqueCode\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    definitionGroups(filter: {categoryUniqueCodeIn: $categoryUniqueCodeIn}) {\n      activityType: __typename\n      id\n      completed\n      uniqueCode\n      orderNumber: definitionGroupNumber\n      recallType\n      removeVisceralisation\n      definitions {\n        id\n        responsesPendingMarking: definitionRecallResponses(filter: {isMarked: false}) {\n          id\n          __typename\n        }\n        __typename\n      }\n    }\n    progressQuizGroups(filter: {categoryUniqueCodeIn: $categoryUniqueCodeIn}) {\n      activityType: __typename\n      id\n      completed\n      uniqueCode\n      quizType\n      orderNumber: progressQuizGroupNumber\n      progressQuizQuestions {\n        id\n        __typename\n      }\n      name\n    }\n    articleLessons(filter: {categoryUniqueCodeIn: $categoryUniqueCodeIn}) {\n      activityType: __typename\n      id\n      completed\n      uniqueCode\n      title\n      length\n      orderNumber: lessonNumber\n    }\n    examHowToLessons(filter: {categoryUniqueCodeIn: $categoryUniqueCodeIn}) {\n      activityType: __typename\n      id\n      completed\n      uniqueCode\n      title\n      length\n      orderNumber: lessonNumber\n      examPaperQuestion {\n        examPaperQuestionParts {\n          marksAvailable\n          __typename\n        }\n        __typename\n      }\n      inVideoQuizQuestions {\n        id\n        __typename\n      }\n    }\n    videoLessons(filter: {categoryUniqueCodeIn: $categoryUniqueCodeIn}) {\n      activityType: __typename\n      id\n      completed\n      uniqueCode\n      title\n      length\n      orderNumber: lessonNumber\n      inVideoQuizQuestions {\n        id\n        __typename\n      }\n    }\n    __typename\n  }\n}"
    };
    let response = await apiFetch(auth, body);

    console.log(response);
    response = response.data.subsection;
    subsections.articles = response.articleLessons;
    subsections.quizzes = response.progressQuizGroups;
    subsections.videos = response.videoLessons;
    console.log(subsections);
    return subsections;
}

function completeArticle(auth, article) {
    console.log("# completeArticle");
    const id = article.id;
    const timeSpent = 5.547; // change to random
    const body = {
        "operationName": "CompleteArticleLesson",
        "variables": {
            "lessonId": id,
            "timeSpent": timeSpent
        },
        "query": "mutation CompleteArticleLesson($lessonId: ID!, $timeSpent: Decimal!) {\n  completeArticleLesson(lessonId: $lessonId, timeSpent: $timeSpent) {\n    id\n    __typename\n  }\n}"
    };
    apiFetch(auth, body);
}

function completeQuiz(auth, quiz) {
    console.log("# completeQuiz");
    const id = quiz.id;
    const body = {
        "operationName": "CompleteProgressQuizGroup",
        "variables": {
            "progressQuizGroupId": id
        },
        "query": "mutation CompleteProgressQuizGroup($progressQuizGroupId: ID!) {\n  completeProgressQuizGroup(progressQuizGroupId: $progressQuizGroupId)\n}"
    };
    apiFetch(auth, body);
}

function generateAnswers(question) {
    console.log("# generateAnswers");
    const answer = {
        "answer": "{\"value\":[\"\"]}",  // may be an invalid answer?
        "timeSpent": "PT0.6985"  // random
    };
    let answers = [];
    const length = question.quizContent.quizDefinition.questions.length;
    for (i = 0; i < length; i++) {
        answers.push(answer)
    }
    return answers;
}

async function completeInVideoQuestion(auth, question) {
    console.log("# completeInVideoQuestion");
    const id = question.id;
    const body = {
        "operationName": "AnswerInVideoQuestion",
        "variables" :{
            "questionId": id,
            "responses": generateAnswers(question)
        },
        "query": "mutation AnswerInVideoQuestion($questionId: ID!, $responses: [QuestionResponse]!) {\n  answerInVideoQuestion(questionId: $questionId, responses: $responses) {\n    responses {\n      ...Response\n      __typename\n    }\n    question {\n      quizContent {\n        __typename\n        ...MarkedQuestion\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment Response on MarkingResponse {\n  responseId\n  correct\n  feedbacks {\n    correctness\n    fieldIndex\n    messages {\n      type\n      content\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment MarkedQuestion on QuizContent {\n  __typename\n  quizDefinition {\n    __typename\n    questions {\n      ...MarkedQuestionPart\n      __typename\n    }\n    explanation {\n      __typename\n      text\n      image\n      topImage\n    }\n  }\n  explanation\n}\n\nfragment MarkedQuestionPart on QuizQuestion {\n  __typename\n  ... on MultipleChoiceQuestion {\n    options {\n      explanation\n      explanationImage\n      __typename\n    }\n    correctOptionIndex\n    __typename\n  }\n  ... on MultiMultipleChoiceQuestion {\n    options {\n      explanation\n      explanationImage\n      correct\n      __typename\n    }\n    __typename\n  }\n  ... on DrawQuestion {\n    modelAnswer\n    __typename\n  }\n  ... on OpenEndedQuestion {\n    modelAnswer\n    __typename\n  }\n}"
    };
    await apiFetch(auth, body);
}

 async function completeVideo(auth, video) {
    console.log("# completeVideo");
    const id = video.id;

    const url = window.location.href;
    const path = new URL(url).pathname.split('/').filter(Boolean);
    const [moduleUniqueCode, subsectionUniqueCode] = path.slice(-2);
    const getLessonBody = {
        "operationName": "GetVideoLesson",
        "variables": {
            "moduleUniqueCode": moduleUniqueCode,
            "subsectionUniqueCode": subsectionUniqueCode,
            "uniqueCode": video.uniqueCode,
            "inVideoQuestionOrder": [
                {
                    "field": "TRIGGER_TIME",
                    "direction": "ASC"
                }
            ]
        },
        "query": "query GetVideoLesson($uniqueCode: String!, $subsectionUniqueCode: String!, $moduleUniqueCode: String!, $inVideoQuestionFilter: InVideoQuestionFilter, $inVideoQuestionOrder: [InVideoQuestionOrdering]) {\n  videoLesson(\n    filter: {uniqueCode: $uniqueCode, subsectionUniqueCode: $subsectionUniqueCode, moduleUniqueCode: $moduleUniqueCode}\n  ) {\n    id\n    module {\n      id\n      uniqueCode\n      title\n      examBoardSubject {\n        subject: subjectObject {\n          qualification {\n            uniqueCode\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    subsection {\n      id\n      name\n      uniqueCode\n      __typename\n    }\n    wistiaId\n    uniqueCode\n    title\n    length\n    duration\n    extraContent\n    skipRecapStartTime\n    preVideoQuestions {\n      __typename\n      id\n      quizContent {\n        ...UnmarkedQuestion\n        __typename\n      }\n    }\n    inVideoQuizQuestions(\n      filter: $inVideoQuestionFilter\n      order: $inVideoQuestionOrder\n    ) {\n      __typename\n      id\n      triggerTime\n      postQuestionResumeTime\n      quizContent {\n        __typename\n        ...UnmarkedQuestion\n      }\n    }\n    __typename\n  }\n}\n\nfragment UnmarkedQuestion on QuizContent {\n  __typename\n  id\n  stem\n  quizDefinition {\n    __typename\n    questions {\n      ...UnmarkedQuestionPart\n      __typename\n    }\n  }\n}\n\nfragment UnmarkedQuestionPart on QuizQuestion {\n  __typename\n  ... on MultipleChoiceQuestion {\n    question\n    description\n    image\n    topImage\n    options {\n      text\n      image\n      __typename\n    }\n    __typename\n  }\n  ... on MultiMultipleChoiceQuestion {\n    question\n    description\n    image\n    topImage\n    options {\n      text\n      image\n      __typename\n    }\n    __typename\n  }\n  ... on TextQuestion {\n    question\n    description\n    image\n    topImage\n    beforeText\n    afterText\n    __typename\n  }\n  ... on NumericalQuestion {\n    question\n    description\n    image\n    topImage\n    beforeText\n    afterText\n    __typename\n  }\n  ... on MathsQuestion {\n    question\n    description\n    image\n    topImage\n    __typename\n  }\n  ... on MultipleInputQuestion {\n    questionSegments {\n      type: __typename\n      ... on MultipleInputQuestionText {\n        text\n        __typename\n      }\n      ... on MultipleInputQuestionBlank {\n        fieldIndex\n        __typename\n      }\n    }\n    description\n    image\n    topImage\n    __typename\n  }\n  ... on ChemistryQuestion {\n    question\n    description\n    image\n    topImage\n    __typename\n  }\n  ... on DropdownQuestion {\n    question\n    description\n    image\n    topImage\n    dropdownOptions\n    __typename\n  }\n  ... on DrawQuestion {\n    question\n    description\n    image\n    topImage\n    drawOn\n    __typename\n  }\n  ... on OpenEndedQuestion {\n    question\n    description\n    image\n    topImage\n    __typename\n  }\n}"
    };
    const lesson = await apiFetch(auth, getLessonBody);
    const questions = lesson.data.videoLesson.inVideoQuizQuestions;

    for (const question of questions) {
        // await completeInVideoQuestion(auth, question);
    }

    const timeSpent = 73.31; // random
    const percentWatched = 0.51; // random
    const completeLessonBody = {
        "operationName": "CompleteVideoLesson",
        "variables": {
            "lessonId": id,
            "percentWatched": percentWatched,
            "timeSpent": timeSpent
        },
        "query": "mutation CompleteVideoLesson($lessonId: ID!, $timeSpent: Decimal!, $percentWatched: Decimal!) {\n  completeVideoLesson(\n    lessonId: $lessonId\n    timeSpent: $timeSpent\n    percentWatched: $percentWatched\n  ) {\n    id\n    timeSpent\n    __typename\n  }\n}"
    };

    apiFetch(auth, completeLessonBody);
}

async function completeAssignment() {
    console.log("# completeAssigment");

    const auth = await getAuth();
    const subsections = await getSubsections(auth);
    console.log("# completeAssigment continues");
    
    for (article of subsections.articles) {
        completeArticle(auth, article);
    }
    for (quiz of subsections.quizzes) {
        completeQuiz(auth, quiz);
    }
    for (video of subsections.videos) {
        completeVideo(auth, video);
    }
}

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

async function skipVideoLesson(url) {
    console.log("# skipVideoLesson");
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

function checkVideoLesson() {
    console.log("# checkVideoLesson");
    const url = window.location.href;
    if (url.slice(-5) == "video") {
        skipVideoLesson(url);
    }
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
    }
});
