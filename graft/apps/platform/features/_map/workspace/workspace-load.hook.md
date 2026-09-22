# apps/platform/features/_map/workspace/workspace-load.hook.ts · [[workspace-dataview-instance-management]] [[workspace-persistence-and-migration]]

Module that exports workspace loading and fitting hooks to initialize map viewport and timerange from workspace configuration on route transitions.

- useFitWorkspaceBounds · function · L34-L66 — Provides callbacks to center the map on the workspace viewport and set the timerange from workspace bounds, conditionally skipping the viewport if a URL viewport or area report location is present.
- useFetchWorkspace · function · L68-L100 — Dispatches a workspace fetch thunk and applies viewport and timerange settings to the map, updating query params with any dataview instances.
- useEnsureWorkspaceLoad · function · L102-L119 — Triggers a workspace fetch when the user is logged in and workspace fetch parameters become available, avoiding duplicate fetches via stringified params key.
