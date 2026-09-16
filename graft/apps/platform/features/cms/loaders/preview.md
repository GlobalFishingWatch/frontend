# apps/platform/features/cms/loaders/preview.ts · [[cms-content-management]]

Defines CMS request mode resolution logic for preview and cache control in a Strapi-backed content system.

- CmsRequestMode · type · L1-L5 — Configuration object that controls whether cached CMS content is used and what publication status (draft or published) is requested from Strapi.
- isAuthorized · function · L7-L21 — Checks whether a request parameter is present and valid, allowing preview or cache-bypass based on environment (dev) or secret token matching.
- resolveCmsRequestMode · function · L23-L35 — Determines CMS request configuration by evaluating preview authorization and cache bypass flags to set cache usage and content status.
