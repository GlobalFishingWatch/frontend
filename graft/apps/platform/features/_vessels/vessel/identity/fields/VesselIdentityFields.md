# apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityFields.tsx · [[configuration-driven-layout-pattern]] [[redux-state-selectors]] [[time-range-filtering-pattern]] [[vessel-identity-field-rendering]]

Renders a section of vessel identity fields with conditional field visibility based on data pipeline version and special handling for different VMS sources.

- VesselIdentityFieldsProps · type · L30-L39 — Props type definition for the VesselIdentityFields component specifying identity data, display labels, and VMS source type flags.
- CombinedSourceValueField · type · L41-L41 — Type alias that constrains field keys to those defined in the COMBINED_SOURCE_VALUE_FIELDS constant for multi-source identity fields.
- resolveFieldValue · function · L43-L76 — Extracts and formats the appropriate vessel identity field value, handling API login requirements, combined sources with timerange filtering, registry fields, and special cases like Chilean VMS SSVID masking.
- VesselIdentityFields · function · L78-L159 — React component that renders grouped vessel identity fields with conditional filtering for pipe 4/5 data sources, terminology annotations, and specialized renderers for ship/gear types.
