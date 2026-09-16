# apps/platform/features/_vessels/search/advanced/SearchAdvanced.tsx · [[guest-user-authorization]] [[multi-filter-advanced-search]] [[vessel-search-system]]

Provides an advanced vessel search interface with filtering, suggestions, and paginated results for authenticated Global Fishing Watch users.

- SearchAdvanced · function · L42-L192 — React component that renders an advanced vessel search form with filters, query input, error handling, and lazy-loaded results display.
- handleSearchQueryChange · function · L96-L100 — Updates the vessel name search input field and triggers a debounced query parameter sync.
- handleSearchIdChange · function · L102-L104 — Updates the vessel ID filter for GFW users in the search filters state.
