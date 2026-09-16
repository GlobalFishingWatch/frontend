# apps/platform/features/_map/content-panel/ContentMarkdown.tsx · [[markdown-rendering-and-extensions]]

Renders markdown content with conditional styling and extensions based on display variant (default or chat mode).

- ContentMarkdownProps · type · L14-L17 — Defines the prop interface for the ContentMarkdown component with optional children string and variant selection.
- ContentMarkdown · function · L32-L54 — Renders markdown with variant-specific configuration—chat mode enables streaming extensions and disables HTML, while default mode enables prose styling, frontmatter, and heading IDs.
