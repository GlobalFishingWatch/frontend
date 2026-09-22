# apps/user-groups-admin/src/components/user-groups/List.tsx · [[permission-based-access-control]] [[user-groups-administration-system]]

React component that displays a searchable list of user groups with access control filtering based on admin permissions and group types.

- UserGroupsListProps · type · L16-L20 — Defines the props interface for the UserGroupsList component, specifying the active group ID, current user data, and click handler.
- UserGroupsList · function · L22-L81 — Renders a searchable list of user groups, filtered by user permissions and query string, with click handling for group selection.
- fetchGroups · function · L25-L28 — Fetches user groups from the API and sorts them alphabetically by name.
