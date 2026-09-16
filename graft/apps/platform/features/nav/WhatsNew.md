# apps/platform/features/nav/WhatsNew.tsx · [[navigation-system]] [[server-side-rendering-ssr-safety-pattern]]

React component that displays a navigation button linking to platform updates, tracking the app version and showing a visual hint when a new version is available since the user's last visit.

- parseVersion · function · L17-L20 — Extracts and normalizes only the major and minor version numbers from a semantic version string for comparison.
- getClientWhatsNewSnapshot · function · L24-L31 — Determines whether a new version has been released since the user last visited by comparing stored and current versions.
- getServerWhatsNewSnapshot · function · L33-L35 — Server-side snapshot function for useSyncExternalStore that currently returns a static false value.
- dismissWhatsNewSnapshot · function · L37-L40 — Persists the current version to local storage and clears the new version indicator when the user dismisses the hint.
- WhatsNew · function · L42-L79 — React component that renders a clickable icon button linking to platform updates, showing a special hint when a new version is available.
- dismissNewVersionHint · function · L55-L58 — Callback that dismisses the new version hint when the user clicks the icon button or navigates to the updates page.
