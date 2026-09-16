# apps/platform/features/_map/map/popups/user/UserPointsTooltipSection.tsx · [[dataviews-datasets-state]] [[feature-grouping-pattern]] [[map-popup-system]]

Renders a tooltip section that displays user-defined points grouped by layer type with dataset labels and interactive context tooltips.

- UserPointsTooltipSectionProps · type · L16-L19 — Type definition that specifies the props interface for the UserPointsTooltipSection component, accepting picking objects and a details visibility flag.
- UserPointsTooltipSection · function · L21-L62 — React component that renders grouped user point features as organized tooltip sections, looking up dataset labels and delegating row rendering to ContextTooltipRow subcomponents.
