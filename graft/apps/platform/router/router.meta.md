# apps/platform/router/router.meta.ts · [[seo-and-metadata]]

Meta tag and canonical URL builders for Open Graph, Twitter, and structured data across map, vessel, workspace, and search routes in the Global Fishing Watch application.

- WorkspaceCategoryDescriptionKey · type · L8-L9 — Type alias that constrains workspace category keys to valid translation keys for site descriptions.
- buildCanonicalUrl · function · L21-L25 — Constructs a canonical absolute URL by normalizing the pathname with the site origin and base path.
- getCanonicalPathname · function · L27-L28 — Resolves the canonical pathname by redirecting vessel detail pages to their specific vessel route.
- getCanonicalLink · function · L31-L37 — Generates a canonical link element object for SEO to prevent duplicate content indexing across URL variations.
- getDefaultMeta · function · L39-L116 — Builds the standard set of HTML meta tags and link tags for viewport, social media, icons, and browser theming.
- getHeadTitle · function · L118-L118 — Formats a page title by prefixing it with the 'GFW' brand identifier.
- getRouteHead · function · L120-L132 — Generates page head meta tags for a generic route with category and description, falling back to translations.
- VesselHeadData · type · L134-L143 — Union type that defines the optional vessel information passed to generate SEO metadata for vessel detail pages.
- getVesselHead · function · L145-L188 — Constructs SEO and Open Graph metadata for vessel detail pages, including name, flag, IMO, MMSI, and structured data markup.
- getWorkspaceHead · function · L190-L193 — Generates page head metadata for workspace category pages by fetching translated descriptions.
- getSearchHead · function · L195-L200 — Generates page head metadata for the search results page with translated title and description.
