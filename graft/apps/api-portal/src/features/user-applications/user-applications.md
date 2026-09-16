# apps/api-portal/src/features/user-applications/user-applications.ts · [[form-state-validation-patterns]] [[server-state-management-via-react-query]] [[user-applications-api-layer]]

- UserApplicationCreateArguments · type · L11-L14 — Defines the input schema for creating a new user application by excluding system-assigned fields from the UserApplication type.
- fetchUserApplications · function · L16-L27 — Fetches the paginated list of user applications from the API for a given user.
- useUserApplications · function · L29-L37 — React Query hook that retrieves and caches a user's applications, skipping the fetch when no userId is provided.
- deleteUserApplication · function · L39-L46 — Sends a DELETE request to remove a user application by ID from the API.
- useDeleteUserApplication · function · L48-L56 — React Query mutation hook that deletes a user application and invalidates the cached applications list on success.
- createUserApplication · function · L60-L69 — Creates a higher-order function that submits a new user application to the API with the given user ID.
- useCreateUserApplication · function · L75-L115 — Provides a controlled form interface for creating user applications with validation of name and description fields, permission checks, and cache invalidation on success.
