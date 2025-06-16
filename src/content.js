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
    console.log("# apiFetch finished");
    return response;
}

async function getAuth() {
    console.log("# getAuth");
    return "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ1cGxlYXJuLmNvLnVrIiwiZXhwIjoxNzUyNjc2MTgwLCJpYXQiOjE3NDk5OTc3ODAsImlzcyI6InVwbGVhcm4uY28udWsiLCJqdGkiOiIxNmY3NjBhNy1lYjQ4LTRhZDgtYTIyNi1mNjdkZDkxMjlmY2EiLCJuYmYiOjE3NDk5OTc3NzksInN1YiI6Ijk4ODk4NiIsInR5cCI6ImFjY2VzcyJ9._KFvEJ7bea6jR23sIH-hwoOMGOqUmIyvHW_jrGcVwk98W2HZj0glya_LRbOjzpLxmgPDekqJD5JymEyLnhTxRQ";
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

function completeVideo(auth, video) {
    console.log("# completeVideo");
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

console.log("# hey im here!")
completeAssignment();
