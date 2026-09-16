# apps/platform/features/_vessels/search/Search.tsx · [[vessel-search-system]]

React component that renders vessel search UI with error handling, loading states, and conditional display of basic or advanced search modes.

- Search · function · L39-L131 — Main search component that conditionally renders either a basic or advanced vessel search interface based on user permissions and workspace/dataset status.
- onSuggestionClick · function · L72-L77 — Handles clicking a search suggestion by dispatching a flag and navigating to the suggested search query.
