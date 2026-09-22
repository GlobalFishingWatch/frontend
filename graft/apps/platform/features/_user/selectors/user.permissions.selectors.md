# apps/platform/features/_user/selectors/user.permissions.selectors.ts · [[user-authorization-permissions-system]]

Provides Redux selectors for checking user permissions, badges, groups, and accessing user-owned resources like workspaces, reports, and datasets.

- hasUserPermission · function · L23-L27 — Factory function that creates a selector to check if the current user has a specific permission by looking it up in their permission list.
- selectUserDatasetsByCategory · function · L142-L145 — Factory function that creates a selector to filter user-owned datasets by their category type.
