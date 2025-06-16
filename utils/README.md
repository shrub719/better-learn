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

## Headers

`authorization` seems constant throughout the session.

The `Cookie`, I'm not sure.
