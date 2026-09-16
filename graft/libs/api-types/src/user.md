# libs/api-types/src/user.ts · [[access-control-ownership-models]] [[api-types-type-definitions]]

Type definitions for user authentication, permissions, badges, and profile data across the GFW platform.

- BADGES_GROUP · type · L11-L16 — Union type defining the set of valid GFW badge group identifiers that can be assigned to users.
- BADGES_PERMISSIONS · type · L18-L23 — Union type enumerating the badge-related permission strings that control access to badge-dependent features.
- UserPermissionType · type · L25-L36 — Union type categorizing the different resource types for which permissions can be granted.
- UserPermissionValue · type · L38-L67 — Union type representing specific feature, workspace, or resource values that can be referenced in a permission grant.
- UserPermissionAction · type · L69-L70 — Union type defining the operations (read, write, delete, etc.) a user may be allowed to perform on a resource.
- UserPermission · type · L72-L76 — Object type representing a single permission grant composed of resource type, value, and allowed action.
- UserGroupId · type · L78-L93 — Union type specifying the set of valid country and organizational group identifiers for user categorization.
- UserGroup · type · L95-L103 — Generic object type representing a user group with membership, roles, and administrative metadata.
- FutureUserData · type · L105-L110 — Object type representing a user pending invitation with assigned groups and optional onboarding notes.
- UserData · type · L112-L133 — Object type representing the complete authenticated user profile including permissions, identity, and application metadata.
