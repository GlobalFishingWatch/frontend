# apps/platform/features/_map/content-panel/MarkdownLink.tsx · [[localization-and-resource-keys]] [[markdown-rendering-and-extensions]] [[router-and-url-state-management]]

Module that exports a React component for rendering markdown links with context-aware routing and side-panel navigation.

- MarkdownLinkProps · type · L9-L9 — Type alias for anchor element props extended with standard HTML anchor attributes.
- MarkdownLink · function · L11-L78 — React component that intercepts markdown links and routes them based on destination: fragment links open user guide panels, same-route links update query params, and external links open in new tabs.
- handleClick · function · L59-L71 — Click handler that prevents default navigation and merges parsed query parameters with current side-panel state before updating the route.
