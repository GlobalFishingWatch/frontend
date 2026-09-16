# apps/platform/features/_map/workspace/vessels/VesselDownload.tsx · [[vessel-tracking-and-metadata]]

Provides a React component for downloading vessel tracking data with authentication and permission checks.

- VesselDownloadButtonProps · type · L14-L19 — Type definition that extends VesselLayerPanelProps with vessel ID, title, dataset ID, and optional icon type for the download button.
- VesselDownloadButton · function · L21-L68 — React component that renders a download button for vessel tracking data, enforcing user login and dataset download permissions.
- onDownloadClick · function · L37-L47 — Click handler that dispatches vessel download metadata and opens the download modal.
