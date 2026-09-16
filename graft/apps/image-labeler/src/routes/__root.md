# apps/image-labeler/src/routes/__root.tsx · [[authentication-state-machine-and-permission-gating]] [[image-labeler-application-bootstrap-and-routing]] [[tanstack-router-file-based-routing-with-code-splitting]]

Root route module that authenticates users, checks labeling-project permissions, and renders the app layout with logout functionality.

- RootComponent · function · L17-L54 — Root React component that enforces authentication and labeling-project read permissions, displaying either a spinner, permission-denied UI, or the main app outlet.
