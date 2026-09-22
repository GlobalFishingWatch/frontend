# apps/port-labeler/src/features/user/user.selectors.ts · [[user-authentication-permissions]]

Redux selectors module that exports permission checks and data accessors for the authenticated user's profile, workspace capabilities, and group membership.

- hasUserPermission · function · L19-L23 — Higher-order selector factory that checks whether a user has a specific permission by validating against their permission list.
