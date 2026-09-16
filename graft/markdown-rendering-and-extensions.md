---
name: Markdown Rendering and Extensions
slug: markdown-rendering-and-extensions
type: system
sources:
  - path: apps/platform/features/_map/content-panel/ContentMarkdown.tsx
    hash: 5f1bdd100020a382498ee9d3eb57b61b217605deb65a1931924683e8b10adc4b
  - path: apps/platform/features/_map/content-panel/markdown-highlighter.ts
    hash: dad5243c1deda534bb2e0f87b483648ba1a8566ae5d416f76764520d8f5f78ba
  - path: apps/platform/features/_map/content-panel/MarkdownIframe.tsx
    hash: d314c59cfd5b214f25cdb94b99619d8f8e38a3b372e7046ba40747f1df2878bf
  - path: apps/platform/features/_map/content-panel/MarkdownImage.tsx
    hash: 3a63335d5c9391af8f1ca2092d94828e7196ecf6d4d2168e36a3983f2abcb57d
  - path: apps/platform/features/_map/content-panel/MarkdownLink.tsx
    hash: b7b6d2382e048a06c37412e974f754dfe2d06b961949c47bced0576786752691
sources_digest: 730d1333b10909b7a15a1db05c5fd710b7aaf58f174ef2a5b126b9c74cecd16f
links:
  - to: responsive-ui-patterns
    relation: uses
    description: >-
      MarkdownImage disables lightbox on small screens via useSmallScreen;
      MarkdownIframe enforces responsive 16:9 ratio
  - to: router-and-url-state-management
    relation: uses
    description: >-
      MarkdownLink uses useAppSearch and useReplaceQueryParams to navigate
      same-route links while preserving side panel state
  - to: user-guide-system
    relation: uses
    description: >-
      ContentMarkdown renders guide sections; MarkdownLink handles navigation
      between guide sections and map state
generator:
  version: 1
covers:
  - symbol: ContentMarkdownProps
    kind: type
    at: 'apps/platform/features/_map/content-panel/ContentMarkdown.tsx:L14-L17'
  - symbol: ContentMarkdown
    kind: function
    at: 'apps/platform/features/_map/content-panel/ContentMarkdown.tsx:L32-L54'
  - symbol: MarkdownIframeProps
    kind: type
    at: 'apps/platform/features/_map/content-panel/MarkdownIframe.tsx:L1-L1'
  - symbol: MarkdownIframe
    kind: function
    at: 'apps/platform/features/_map/content-panel/MarkdownIframe.tsx:L3-L9'
  - symbol: MarkdownImageProps
    kind: type
    at: 'apps/platform/features/_map/content-panel/MarkdownImage.tsx:L9-L9'
  - symbol: MarkdownImage
    kind: function
    at: 'apps/platform/features/_map/content-panel/MarkdownImage.tsx:L11-L44'
  - symbol: MarkdownLinkProps
    kind: type
    at: 'apps/platform/features/_map/content-panel/MarkdownLink.tsx:L9-L9'
  - symbol: MarkdownLink
    kind: function
    at: 'apps/platform/features/_map/content-panel/MarkdownLink.tsx:L11-L78'
  - symbol: handleClick
    kind: function
    at: 'apps/platform/features/_map/content-panel/MarkdownLink.tsx:L59-L71'
---

<!-- context:generated:start -->

## Summary

Custom markdown rendering pipeline with specialized components for images (lightbox modal on desktop), links (section anchors, external, same-route), iframes (responsive 16:9 aspect ratio), and code highlighting (plaintext/HTML syntax support). Supports two rendering modes: chat (streaming, no HTML) and default (full document features).

## Related

- uses [[responsive-ui-patterns]] — MarkdownImage disables lightbox on small screens via useSmallScreen; MarkdownIframe enforces responsive 16:9 ratio
- uses [[router-and-url-state-management]] — MarkdownLink uses useAppSearch and useReplaceQueryParams to navigate same-route links while preserving side panel state
- uses [[user-guide-system]] — ContentMarkdown renders guide sections; MarkdownLink handles navigation between guide sections and map state

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
