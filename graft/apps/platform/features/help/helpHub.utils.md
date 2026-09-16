# apps/platform/features/help/helpHub.utils.ts · [[help-hub-system]]

Utility module for transforming CMS content into help hub items and extracting card-displayable content.

- findHelpHubSection · function · L14-L19 — Locates a help hub section by its slug identifier.
- toSubsections · function · L21-L33 — Transforms Strapi subsection records into standardized HelpHubItemSubsection objects.
- toUserGuideItems · function · L35-L44 — Converts user guide content from CMS into normalized help hub item array.
- toUseCaseItems · function · L46-L55 — Transforms use case content from CMS into standardized help hub items using role as title.
- toDataUpdateItems · function · L57-L66 — Converts data update entries into help hub items with publication date metadata.
- getFirstBodyImage · function · L75-L84 — Extracts the first image from markdown or HTML body content, returning both URL and alt text.
- CardBodies · type · L86-L86 — Type definition for objects containing markdown bodies and optional subsections with bodies.
- toCardItem · function · L88-L101 — Filters item fields to card-compatible keys and extracts the first image from body or subsections.
- toCardResponse · function · L103-L106 — Maps a Strapi response array through card item transformation to reduce payload size.
- getCardImage · function · L109-L122 — Resolves card image by preferring thumbnail, then falling back to first image found in body or subsections.
