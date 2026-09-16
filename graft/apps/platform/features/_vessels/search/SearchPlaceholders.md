# apps/platform/features/_vessels/search/SearchPlaceholders.tsx · [[guest-user-authorization]] [[vessel-search-system]]

Component library providing placeholder and empty state UI for vessel search results across different scenarios (loading, no results, empty, not allowed).

- SearchPlaceholderProps · type · L21-L24 — Type definition for optional className and children props used across all search placeholder components.
- SearchPlaceholder · function · L26-L32 — Base wrapper component that renders centered empty state content with optional className.
- SearchNoResultsState · function · L34-L49 — Placeholder component that displays when vessel search returns no matching results, suggesting alternative search fields.
- SearchEmptyState · function · L52-L102 — Placeholder component that displays initial state, loading spinner, or context-aware instructions based on search mode and guest user permissions.
- SearchNotAllowed · function · L104-L111 — Placeholder component that displays when the user lacks permission to perform a vessel search.
