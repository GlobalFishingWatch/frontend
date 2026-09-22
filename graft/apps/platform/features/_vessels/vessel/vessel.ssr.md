# apps/platform/features/_vessels/vessel/vessel.ssr.ts · [[identity-source-prioritization]] [[server-side-rendering-integration]]

Server-side renderer that pre-fetches vessel metadata and resolves the correct identity to populate page head tags for shared URLs.

- VesselLoaderArgs · type · L15-L19 — Type definition for arguments passed to the vessel SSR loader function.
- getUrlIdentity · function · L23-L41 — Resolves the correct vessel identity to display based on URL parameters and available identity sources, ensuring shared URLs show consistent metadata.
- ssrLoadVessel · function · L43-L75 — Async SSR loader that fetches vessel information and dataviews during server-side rendering, then extracts and returns vessel metadata for page head tags.
