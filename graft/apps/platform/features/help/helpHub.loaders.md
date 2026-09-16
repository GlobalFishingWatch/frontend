# apps/platform/features/help/helpHub.loaders.ts · [[help-hub-system]]

Server-side loader module that fetches and transforms Help Hub content from CMS across multiple sections with error handling and caching.

- HelpHubSectionData · type · L13-L16 — Represents a Help Hub section's items and optional error state.
- HelpHubSectionItems · type · L18-L18 — Maps all Help Hub section IDs to their respective loaded data.
- HelpHubFetchOptions · type · L20-L20 — Controls content fetch behavior via slug targeting, variant selection, or first-item retrieval.
- HelpHubArticleData · type · L22-L26 — Holds a Help Hub article's index, an optional selected item, and any loading error.
- toErrorMessage · function · L46-L54 — Extracts and formats error message with optional error code for user-friendly display.
- getHelpHubLocale · function · L56-L58 — Resolves the active UI language to the corresponding CMS content locale.
- loadHelpHubSection · function · L67-L79 — Fetches Help Hub content for a given section and locale, returning items or error state.
- loadHelpHubSections · function · L81-L89 — Loads all Help Hub sections in parallel and returns them as a map keyed by section ID.
- loadHelpHubArticle · function · L91-L105 — Loads an article index and optionally a specific article by slug for a Help Hub section.
