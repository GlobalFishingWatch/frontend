# apps/platform/features/_reports/report-vessel-group/VesselGroupReportLink.tsx · [[vessel-group-report-feature]]

React component that wraps children in a navigable link to the vessel group report page with analytics tracking.

- VesselGroupReportLinkProps · type · L16-L19 — Type definition for the props accepted by VesselGroupReportLink component, specifying vessel group identifier and child React elements.
- VesselGroupReportLink · function · L21-L51 — React component that renders a navigable link to a vessel group report page, with conditional rendering based on workspace and vesselGroupId availability.
- analysisRedirect · function · L24-L30 — Callback function that tracks analytics events when a user accesses a vessel group profile from the report link.
