# apps/platform/features/_vessels/vessel/vessel.types.ts · [[vessel-config-and-state-types]]

Defines TypeScript types and enums for vessel profile state, events, and navigation sections used across the vessel feature.

- ActivityEventSubType · enum · L3-L6 — Enum defining port activity event types (entry and exit) for vessel monitoring.
- ActivityEvent · interface · L7-L10 — Interface extending ApiEvent with voyage identifier and optional activity event subtype classification.
- VesselEvent · type · L12-L12 — Type combining activity and generic API events with optional vessel dataset association.
- VesselSection · type · L15-L15 — Type representing the main navigation tabs in the vessel profile UI.
- VesselAreaSubsection · type · L17-L17 — Type for geographic area subsection options (FAO, EEZ, MPA, RFMO) within the vessel areas tab.
- VesselRelatedSubsection · type · L19-L19 — Type for related vessel subsection options (encounters or vessel owners) in the vessel profile.
- VesselProfileActivityMode · type · L21-L21 — Type for activity timeline grouping modes (by voyage or by event type) in the vessel profile.
- VesselProfileState · type · L26-L58 — Type encapsulating all URL query parameters and state properties for vessel profile navigation, identity selection, and display modes.
- VesselProfileStateProperty · type · L60-L60 — Type utility extracting all property names from VesselProfileState for type-safe state management.
