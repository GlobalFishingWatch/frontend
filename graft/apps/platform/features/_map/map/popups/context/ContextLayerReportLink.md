# apps/platform/features/_map/map/popups/context/ContextLayerReportLink.tsx · [[context-layer-tooltips]]

Renders contextual report analysis links for map layer features, supporting operations to open, add, or remove areas from report analysis.

- ContextLayerReportLinkProps · type · L31-L40 — Type definition for props passed to the ContextLayerReportLink component, specifying a picking object feature, optional label, report category, and click handler.
- ContextLayerReportLink · function · L42-L183 — React component that renders conditional analysis report links—disabled analysis button when unsupported, or actionable links to open/add/remove areas from reports based on current report state.
- onReportClick · function · L81-L91 — Click handler that resets report and workspace state, extracts layer sources, and delegates to an optional parent-provided click callback.
