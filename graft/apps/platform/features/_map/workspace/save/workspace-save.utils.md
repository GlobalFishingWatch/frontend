# apps/platform/features/_map/workspace/save/workspace-save.utils.ts · [[workspace-save-edit-modal-subsystem]]

Utility module providing functions to manage workspace access levels, time range modes, and dynamic workspace naming based on view/edit permissions and temporal configurations.

- isValidDaysFromLatest · function · L19-L25 — Validates that a days-from-latest value falls within the allowed range of 1 to 100 days.
- formatTimerangeBoundary · function · L27-L35 — Formats a date boundary string using i18n localization and removes punctuation marks.
- getViewAccessOptions · function · L37-L52 — Generates workspace view access level options with permission labels conditionally displayed for private datasets.
- WorkspaceTimeRangeMode · type · L54-L54 — Type alias representing the two modes for workspace time range configuration: static or dynamic.
- getTimeRangeOptions · function · L55-L73 — Generates time range mode options with formatted date boundaries for static mode based on the date span.
- getEditAccessOptions · function · L75-L83 — Generates workspace edit access level options restricted to private and password-protected modes.
- getEditAccessOptionsByViewAccess · function · L85-L92 — Returns conditional edit access options based on the view access level, restricting options when workspace is private.
- getStaticWorkspaceName · function · L94-L103 — Generates a localized workspace name description for static time ranges using formatted start and end date boundaries.
- getDynamicWorkspaceName · function · L105-L109 — Generates a localized workspace name description for dynamic time ranges based on days from latest.
- getWorkspaceTimerangeName · function · L111-L126 — Generates the appropriate time range name description by delegating to static or dynamic name formatters based on mode.
- ReplaceTimerangeWorkspaceNameParams · type · L128-L135 — Type definition for parameters used when replacing time range descriptions in workspace names.
- replaceTimerangeWorkspaceName · function · L136-L157 — Replaces the old time range description in a workspace name with the new one when transitioning between time range modes.
