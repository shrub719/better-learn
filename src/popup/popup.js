function apiFetch(auth, body) {
    let data;
    fetch("https://web.uplearn.co.uk/api", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${auth}`
        },
        credentials: "include",
        body: JSON.stringify(body)
    })
    .then(res => res.json())
    .then(res => data = res);  
    return data; // returns data?
}

function getAuth() {
    return "thisisarealkey";
};


function getSubsections(auth) {
    const moduleUniqueCode = undefined;
    const subsectionUniqueCode = undefined;
    const body = {
        "operationName": "GetSubsectionOverviewData",
        "variables": {
            "moduleUniqueCode": moduleUniqueCode,
            "subsectionUniqueCode": subsectionUniqueCode,
            "categoryUniqueCodeIn": []
        },
        "query": "query GetSubsectionOverviewData($subsectionUniqueCode: String!, $moduleUniqueCode: String!, $categoryUniqueCodeIn: [String!]) {\n  subsection(\n    filter: {uniqueCode: $subsectionUniqueCode, moduleUniqueCode: $moduleUniqueCode, categoryUniqueCodeIn: $categoryUniqueCodeIn}\n  ) {\n    id\n    name\n    uniqueCode\n    icon\n    locked\n    currentUserScore\n    isDiagnosticQuizEnabled\n    subsectionQuizSession {\n      id\n      currentStep\n      __typename\n    }\n    summary {\n      id\n      released\n      wistiaVideoDuration\n      __typename\n    }\n    subsectionNumber\n    subsectionQuizAvailable\n    preActivitiesNotice\n    postActivitiesNotice\n    module {\n      id\n      title\n      subtitle\n      uniqueCode\n      releaseType\n      schoolYear\n      currentUserEnrolment {\n        id\n        isTrial\n        isActive\n        enrolmentPlan\n        __typename\n      }\n      examBoardSubject {\n        id\n        board\n        subject\n        boardName\n        boardObject {\n          id\n          __typename\n        }\n        subjectName\n        subjectObject {\n          id\n          qualification {\n            uniqueCode\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    definitionGroups(filter: {categoryUniqueCodeIn: $categoryUniqueCodeIn}) {\n      activityType: __typename\n      id\n      completed\n      uniqueCode\n      orderNumber: definitionGroupNumber\n      recallType\n      removeVisceralisation\n      definitions {\n        id\n        responsesPendingMarking: definitionRecallResponses(filter: {isMarked: false}) {\n          id\n          __typename\n        }\n        __typename\n      }\n    }\n    progressQuizGroups(filter: {categoryUniqueCodeIn: $categoryUniqueCodeIn}) {\n      activityType: __typename\n      id\n      completed\n      uniqueCode\n      quizType\n      orderNumber: progressQuizGroupNumber\n      progressQuizQuestions {\n        id\n        __typename\n      }\n      name\n    }\n    articleLessons(filter: {categoryUniqueCodeIn: $categoryUniqueCodeIn}) {\n      activityType: __typename\n      id\n      completed\n      uniqueCode\n      title\n      length\n      orderNumber: lessonNumber\n    }\n    examHowToLessons(filter: {categoryUniqueCodeIn: $categoryUniqueCodeIn}) {\n      activityType: __typename\n      id\n      completed\n      uniqueCode\n      title\n      length\n      orderNumber: lessonNumber\n      examPaperQuestion {\n        examPaperQuestionParts {\n          marksAvailable\n          __typename\n        }\n        __typename\n      }\n      inVideoQuizQuestions {\n        id\n        __typename\n      }\n    }\n    videoLessons(filter: {categoryUniqueCodeIn: $categoryUniqueCodeIn}) {\n      activityType: __typename\n      id\n      completed\n      uniqueCode\n      title\n      length\n      orderNumber: lessonNumber\n      inVideoQuizQuestions {\n        id\n        __typename\n      }\n    }\n    __typename\n  }\n}"
    };
    apiFetch(auth, body);
}

function completeArticle(auth, article) {
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

function completeVideo(auth, video) {
    const id = video.id;
    const timeSpent = 73.31; // random
    const percentWatched = 0.51; // random
    const body = {
        "operationName": "CompleteVideoLesson",
        "variables": {
            "lessonId": id,
            "percentWatched": percentWatched,
            "timeSpent": timeSpent
        },
        "query": "mutation CompleteVideoLesson($lessonId: ID!, $timeSpent: Decimal!, $percentWatched: Decimal!) {\n  completeVideoLesson(\n    lessonId: $lessonId\n    timeSpent: $timeSpent\n    percentWatched: $percentWatched\n  ) {\n    id\n    timeSpent\n    __typename\n  }\n}"
    };
    apiFetch(auth, body);
}

function completeAssignment() {
    const auth = getAuth();
    const subsections = getSubsections(auth);
    
    for (article of subsections.articles) {
        completeArticle(auth, article);
    }
    for (quiz of subsections.quizzes) {
        completeQuiz(quiz);
    }
    for (video of subsections.videos) {
        completeVideo(video);
    }
}

document.getElementById("inject").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab.url.includes("web.uplearn.co.uk")) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: completeAssignment
        });
    }
});