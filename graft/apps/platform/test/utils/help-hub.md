# apps/platform/test/utils/help-hub.ts · [[test-infrastructure-and-utilities]]

Test fixture and DOM helper utilities for HelpHub component specs, providing mock CMS content and query selectors.

- filler · function · L26-L30 — Generates repeated filler text paragraphs to ensure fixture items exceed viewport height for scroll behavior testing.
- strapiBase · function · L32-L40 — Creates a base Strapi content object with common metadata fields required by all CMS content types.
- thumbnail · function · L42-L47 — Constructs a Strapi image object representing a content thumbnail with id, document reference, and display URL.
- landingSection · function · L137-L141 — Queries and returns the landing page section element whose heading matches the given title.
- tocRow · function · L144-L148 — Finds and returns the table-of-contents row element for an item by matching its title text.
- tocRowButtons · function · L150-L152 — Returns all button elements within a table-of-contents row identified by title.
- tocRowTitles · function · L154-L158 — Collects and returns the text content of all table-of-contents row elements as an array.
- activeTocTitle · function · L160-L162 — Retrieves the text content of the currently active table-of-contents item.
- highlightedTexts · function · L164-L168 — Extracts and returns text content from all elements marked with the highlighted CSS class.
- imagesWithSrc · function · L170-L172 — Queries and returns all image elements in the DOM matching the specified src attribute.
- spinners · function · L174-L176 — Finds and returns all SVG spinner elements used for loading state display.
