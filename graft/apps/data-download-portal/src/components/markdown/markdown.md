# apps/data-download-portal/src/components/markdown/markdown.tsx · [[enhanced-markdown-renderer]] [[markdown-with-url-driven-section-state]]

React component that renders markdown with collapsible H2 sections, copy-to-clipboard functionality for section links, and hash-based navigation to expand specific sections.

- extractText · function · L9-L19 — Recursively extracts all text content from a markdown AST phrasing node.
- remarkCollapseH2 · function · L21-L173 — Unified plugin that transforms all level-2 headings in markdown AST into collapsible details elements with copy-URL buttons.
- getLinkHashPath · function · L175-L177 — Constructs the full URL with hash fragment for deep-linking to a specific markdown section.
- EnhancedMarkdown · function · L179-L269 — React component that renders markdown content with collapsible sections, hash-based navigation, and copy-to-clipboard for section URLs.
- updateDetailsOpenState · function · L181-L195 — Opens the details element matching the URL hash and closes all others, then scrolls it into view.
- handler · function · L208-L215 — Toggles the open state of a details element when its h2 heading or arrow icon is clicked.
- handler · function · L221-L242 — Copies the shareable URL for a collapsible section to the clipboard and briefly animates the copy icon.
