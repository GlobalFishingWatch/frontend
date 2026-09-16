# apps/platform/features/cms/loaders/user-guide.types.ts · [[cms-content-management]]

Type definitions and configuration for user guide sections and subsections in the CMS loader.

- UserGuideSectionSlug · type · L61-L61 — Type alias representing all valid top-level user guide section identifiers as keys of the categories configuration.
- SubSectionArrays · type · L63-L63 — Internal helper type that extracts the array of subsection slugs for a given section from the categories configuration.
- UserGuideSubSectionSlug · type · L64-L64 — Type alias representing all valid user guide subsection identifiers extracted from the categories configuration arrays.
- UserGuideSlug · type · L66-L66 — Type alias representing any valid user guide identifier, including both section and subsection slugs.
- UserGuideContent · type · L68-L68 — Type alias representing the complete user guide content structure as an array of sections.
- UserGuideSection · type · L70-L76 — Type defining the structure of a top-level user guide section with title, slug, optional thumbnail and body, and nested subsections.
- UserGuideSubSection · type · L78-L82 — Type defining the structure of a user guide subsection with title, body content, and subsection slug identifier.
