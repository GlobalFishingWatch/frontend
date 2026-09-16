# apps/track-labeler/src/features/user/user.thunks.ts · [[track-labeler-user-authentication]]

Redux thunks module for handling user authentication and login state checks in the track labeler application.

- userLoginThunk · function · L12-L32 — Authenticates a user by extracting an access token from the location query, calling the GFW API login endpoint, and dispatching success or error actions based on the result.
- checkUserLoggedThunk · function · L34-L38 — Checks if a user is already logged in and initiates the login thunk if they are not.
