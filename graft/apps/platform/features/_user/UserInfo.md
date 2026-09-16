# apps/platform/features/_user/UserInfo.tsx · [[group-membership-badge-system]] [[user-profile-settings-panel]]

React component that displays authenticated user information including profile details, user groups, and earned achievement badges with modal detail views.

- Badge · type · L38-L38 — Type union for the five badge categories users can earn.
- BadgeInfo · type · L39-L39 — Type for badge metadata containing images and user ownership status.
- UserInfo · function · L41-L186 — Main React component that renders user profile information, group membership, and GFW earned badges with interactive detail modals.
- onBadgeClick · function · L56-L58 — Callback that opens the detail modal for the selected badge.
- onBadgeModalClose · function · L59-L61 — Callback that closes the badge detail modal.
