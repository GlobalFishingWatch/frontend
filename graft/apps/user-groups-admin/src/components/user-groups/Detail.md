# apps/user-groups-admin/src/components/user-groups/Detail.tsx · [[permission-based-access-control]] [[user-groups-administration-system]]

React component for managing user group membership, allowing admins to view, add, and remove users with CSV export capability.

- UserGroupDetail · function · L10-L237 — React component that displays a user group with active and invited members, allowing admins to add or remove users via email invitations.
- onAddUserClick · function · L38-L64 — Adds a user to the group by email, either directly if they exist or as a future user invitation with optional notes.
- onRemoveUserClick · function · L78-L88 — Removes an active user from the group after confirming with the user.
- onDownloadCsvClick · function · L90-L110 — Exports the group's active and invited users as a CSV file for download.
- onRemoveFutureUserClick · function · L112-L124 — Deletes an invitation to a future user after confirming with the user.
