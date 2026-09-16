# apps/api-portal/src/features/user/user.ts · [[client-side-authentication-flow]] [[server-state-management-via-react-query]] [[user-authentication-profile]]

User authentication and permission management module providing hooks for login state, authorization checks, and user profile updates.

- fetchUser · function · L13-L21 — Authenticates a user by logging in via the GFW API using an optional access token from the URL.
- UserAction · type · L22-L22 — Type definition for user application actions that can be authorized: read, create, or delete.
- checkUserApplicationPermission · function · L23-L29 — Verifies whether a user has a specific permission to perform an action on user applications.
- logoutUser · function · L31-L33 — Signs out the current user by calling the GFW API logout endpoint.
- useUser · function · L35-L77 — React hook that fetches the current user, checks authorization, and provides logout and login functionality.
- updateUserAdditionalFields · function · L79-L93 — Updates user profile fields by sending a PATCH request, filtering out null values before submission.
- useUpdateUserAdditionalInformation · function · L94-L103 — React hook that updates user additional information and navigates to home page on successful completion.
- useUserAdditionalInformation · function · L105-L112 — React hook that updates user additional information and invalidates the user query cache on success.
