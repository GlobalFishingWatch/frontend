# apps/platform/features/_reports/shared/vessels/report-vessels.hooks.ts · [[report-vessel-data-pipeline]] [[vessel-pinning-and-workspace-integration]]

Module providing React hooks for managing vessel pinning/unpinning operations in report dataviews, including vessel resource population and dataview instance creation.

- usePopulateVesselResource · function · L37-L64 — Hook that returns a function to populate vessel resource data into Redux state to avoid refetching vessel info already loaded in the popup.
- populateVesselInfoResource · function · L39-L62 — Callback that dispatches a vessel resource with resolved dataset configuration and endpoint URL to Redux state.
- usePinReportVessels · function · L66-L166 — Hook that provides pinVessels and unPinVessels callbacks to manage adding and removing vessel dataview instances in the workspace.
