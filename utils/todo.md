## To do

- Popup
    - Only trigger if button in popup pressed, otherwise too many requests -> rate limited
- Video skip
    - True skip seems out of reach for now
    - Can skip watching the video and only make the user answer the questions though!!
    - Need to understand the API calls for that though
        - Add to docs!!
    - How
        - Call the next question function? 
            - This happens client side after the InVideoQuestions are fetched, so it's all ugly minified code. Maybe not
        - Intercept the request and change trigger times to be at 0
        - Automatically make the speed super high except at question checkpoints
- Take the other extension's job of setting video speed
