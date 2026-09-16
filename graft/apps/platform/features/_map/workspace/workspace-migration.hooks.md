# apps/platform/features/_map/workspace/workspace-migration.hooks.tsx · [[workspace-persistence-and-migration]]

Module that exports a React hook to notify workspace owners of deprecated dataviews and automate their migration to the latest versions.

- useMigrateWorkspaceToast · function · L31-L144 — Custom React hook that displays a toast notification to workspace owners when deprecated dataviews are detected and handles the migration workflow.
- closeToast · function · L48-L50 — Closes the active migration notification toast.
- onMigrateAllClick · function · L52-L76 — Migrates all deprecated dataview instances, persists them to the workspace, and navigates to the updated workspace view.
- ToastContent · function · L83-L111 — React component that renders the migration disclaimer message and a button to trigger the workspace migration process.
