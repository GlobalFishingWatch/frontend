# apps/platform/features/cms/strapi.types.ts · [[cms-content-management]]

Defines TypeScript types for Strapi CMS API responses, including response envelopes, base entity attributes, images, pagination metadata, and error structures.

- StrapiResponse · type · L1-L7 — Represents the standard response envelope from Strapi API, containing data, error, and pagination metadata.
- StrapiBaseAttributes · type · L9-L17 — Defines common metadata fields shared by all Strapi content entries including identity, timestamps, and localization info.
- StrapiImage · type · L19-L24 — Represents an image asset from Strapi with metadata and URL for rendering.
- StrapiPagination · type · L25-L30 — Encodes pagination metadata to track current page position and total data volume across Strapi list queries.
- StrapiError · type · L32-L37 — Represents error information returned by Strapi API with status code, name, message, and optional validation details.
