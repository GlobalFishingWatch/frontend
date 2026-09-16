# apps/platform/features/_vessels/vessel/identity/vessel-identity.config.ts · [[configuration-driven-layout-pattern]] [[vessel-identity-display-system]]

Configuration file defining vessel identity display fields and layout templates for AIS registry, VMS, and custom source types.

- VesselRenderField · type · L6-L11 — Type defining a renderable field for vessel identity display with optional label, terminology key, and formatting options.
- CustomVMSGroup · type · L85-L90 — Type mapping self-reported VMS data sources to grouped field configurations for country-specific vessel identity layouts.
- IdentitySection · type · L140-L147 — Type defining a reusable section within vessel identity layouts that groups fields by type and associates them with terminology and labels.
