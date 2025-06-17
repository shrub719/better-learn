# API

## Getting overview data

Unique codes for `GetSubsectionOverviewData` are from the URL:
```
https://web.uplearn.co.uk/learn/physics-aqa-13-papers-1-2/describing-simple-harmonic-motion
```
gives codes 
```json
"moduleUniqueCode": "physics-aqa-13-papers-1-2",
"subsectionUniqueCode": "describing-simple-harmonic-motion"
```

## Completing lessons

The various `id` fields in `GetSubsectionOverviewDataResponse`, i.e.
```json
"activityType": "ArticleLesson",
"completed": true,
"id": "32117"
```
are the same `id` used in `Complete` requests:
```json
"operationName": "CompleteArticleLesson",
"variables": {
    "lessonId": "31956",
    ...
```

## Answering in-video questions

It's likely that to have a video marked as complete, you need to have answered all of its questions. The `id` of each question can be found in `GetSubsectionOverviewDataResponse`, but the actual question itself is fetched by `GetVideoLesson`.

Questions are not marked as complete if the response given is of an incorrect format. This means answers need to be specific to that type of question; see [Issue #1](https://github.com/shrub719/uplearn-complete/issues/1).

## Headers

The `authorization` header can be found by the `auth-token` cookie, unique to every session.

`content-type` is usually `application/json` for API calls.

Most other headers can be copied with `credentials: "include"`.

## Generic API template

```js
fetch("https://web.uplearn.co.uk/api/", {
    method: "POST",
    headers: {
        "content-type": "application/json",
        "authorization": `Bearer ${auth}`  // auth-token
    },
    credentials: "include",
    body: JSON.stringify(body)  // request body
});
```
