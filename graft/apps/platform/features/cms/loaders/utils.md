# apps/platform/features/cms/loaders/utils.ts · [[cms-content-management]]

Utility module providing cached and conditional CMS content fetching with fallback to English locale and preview mode support.

- StrapiCollection · type · L13-L13 — Type alias for the shape of a Strapi SDK collection instance.
- FindParams · type · L14-L14 — Type alias extracting Strapi collection find method parameters while excluding locale.
- StrapiCollectionName · type · L16-L23 — Union type defining all available CMS collection names that can be fetched.
- FetchStrapiCollectionParams · type · L25-L29 — Parameter object type for specifying which CMS collection to fetch with query filters and locale.
- fetchStrapiCollection · function · L31-L57 — Fetches a Strapi CMS collection with fallback to English locale when a non-English locale yields no results.
- getCmsRequestMode · function · L68-L78 — Determines whether to use cache or preview mode by resolving CMS request parameters from the URL.
- fetchStrapiCollectionCached · function · L80-L88 — Conditionally routes collection fetches through cache or direct fetch based on preview mode detection.
