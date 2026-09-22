# apps/platform/features/_vessels/vessel/vessel-pin.hooks.ts · [[dataset-management-integration]] [[vessel-workspace-integration]]

Exports type definitions and a custom React hook for handling vessel pin interactions, fetching vessel data, and managing dataview instances in the vessel tracking workspace.

- VesselToResolve · type · L41-L46 — Type representing the minimum vessel information required to resolve and fetch detailed vessel data from an API.
- VesselToSearch · type · L47-L47 — Type representing vessel search parameters with optional dataset filters to locate a vessel in the system.
- VesselPinClickProps · type · L48-L51 — Type for the callback properties passed when a vessel pin is clicked, containing the resulting dataview instance and vessel ID.
- VesselPinOnClickCb · type · L53-L53 — Type for the onClick callback function invoked after a vessel pin interaction completes.
- UsePinVesselParams · type · L55-L63 — Type for parameters passed to the usePinVessel hook, specifying vessel source and configuration for pinning.
- UsePinVesselResult · type · L65-L69 — Type for the return value of the usePinVessel hook, providing a click handler, loading state, and workspace vessel reference.
- usePinVessel · function · L71-L211 — React hook that manages adding or removing a vessel pin to the workspace, resolving vessel identity and datasets as needed.
- onPinClick · function · L101-L208 — Async callback that toggles vessel pin state in workspace, resolving vessel data from API if needed and tracking the interaction.
