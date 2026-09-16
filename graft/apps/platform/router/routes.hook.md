# apps/platform/router/routes.hook.ts · [[route-hooks]]

Router hooks module that provides utilities for search parameter management, navigation, and unsaved workspace detection with confirmation dialogs.

- AppNavigateOptions · type · L17-L19 — Type-safe navigation options that bridge TanStack Router's route-specific search types with a route-agnostic interface.
- useAppSearch · function · L28-L30 — Provides root-level search params without coupling to any specific layout route, allowing shared param access across multiple shells.
- useReplaceQueryParams · function · L32-L60 — Returns utilities to merge query params into the current route or clear all query params while managing scroll behavior.
- useBeforeUnload · function · L62-L86 — Attaches a page unload handler that prompts workspace save for non-guest users on routes with unsaved workspace data.
