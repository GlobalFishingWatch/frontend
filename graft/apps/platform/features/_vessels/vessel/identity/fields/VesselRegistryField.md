# apps/platform/features/_vessels/vessel/identity/fields/VesselRegistryField.tsx · [[gfw-user-permission-gating]] [[registry-data-access-filtering]]

Renders vessel registry information fields including operators, owners, authorizations, and record IDs with filtering and date range display.

- RegistryOperatorField · function · L25-L58 — Renders a vessel registry operator's name, flag, and date range, or a placeholder if no operator data is available.
- VesselRegistryField · function · L59-L198 — Main component that conditionally renders different registry fields (operator, recordId, or authorization/owner lists) based on field type and user permissions, filtering by timerange.
