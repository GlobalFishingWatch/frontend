---
name: Markdown with URL-Driven Section State
slug: markdown-with-url-driven-section-state
type: concept
sources:
  - path: apps/data-download-portal/src/components/markdown/markdown.tsx
    hash: 2ca9dc4b0b155942f5ff36b95f5e8a1c6dd97cca52f37fee8bf85e4b46191549
sources_digest: a7c3cc1aefd82caa24f2f6dd69ee35a85fab9009e684d60c039cb904127e26fd
links:
  - to: enhanced-markdown-renderer
    relation: implements
    description: >-
      Component uses useEffect to manage details element state and hash
      navigation
generator:
  version: 1
covers:
  - symbol: extractText
    kind: function
    at: 'apps/data-download-portal/src/components/markdown/markdown.tsx:L9-L19'
  - symbol: remarkCollapseH2
    kind: function
    at: 'apps/data-download-portal/src/components/markdown/markdown.tsx:L21-L173'
  - symbol: getLinkHashPath
    kind: function
    at: 'apps/data-download-portal/src/components/markdown/markdown.tsx:L175-L177'
  - symbol: EnhancedMarkdown
    kind: function
    at: 'apps/data-download-portal/src/components/markdown/markdown.tsx:L179-L269'
  - symbol: updateDetailsOpenState
    kind: function
    at: 'apps/data-download-portal/src/components/markdown/markdown.tsx:L181-L195'
  - symbol: handler
    kind: function
    at: 'apps/data-download-portal/src/components/markdown/markdown.tsx:L208-L215'
  - symbol: handler
    kind: function
    at: 'apps/data-download-portal/src/components/markdown/markdown.tsx:L221-L242'
---

<!-- context:generated:start -->

## Summary

Data portal readme rendering converts H2 headings to native <details> elements that auto-expand/scroll on hash navigation. Copy buttons on section headers generate shareable links to specific sections. All styling embedded in AST to avoid stylesheet dependencies.

## Related

- implements [[enhanced-markdown-renderer]] — Component uses useEffect to manage details element state and hash navigation

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
