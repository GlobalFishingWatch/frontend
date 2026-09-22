# apps/port-labeler/src/features/app/App.tsx · [[port-labeler-app]]

Root application component that sets up the port labeler app with a split-view layout containing a sidebar and map.

- Window · interface · L18-L20 — Global window interface extension to allow access to the gtag analytics function.
- Main · function · L23-L33 — Renders the main map view within a suspense boundary.
- App · function · L35-L71 — Main application component that orchestrates the split-view layout with sidebar and map, manages sidebar/menu visibility state, and fetches the current user on mount.
