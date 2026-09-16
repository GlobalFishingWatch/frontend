---
name: Safe HTML Parsing Workaround
slug: safe-html-parsing-workaround
type: concept
sources:
  - path: apps/platform/utils/html-parser.tsx
    hash: 5e32b0529b7cfe44ff6f67a3449aecf6b90acc99bcb84c08bb1262e612ebd709
sources_digest: 871a27c7ec9f9a198dd04a0ec2c4b8b2ab4cfdb8f6cb953206fdd9539476d41d
links:
  - to: platform-app-utilities
    relation: part_of
    description: The workaround is encapsulated in the htmlSafeParse function
generator:
  version: 1
covers:
  - symbol: htmlSafeParse
    kind: function
    at: 'apps/platform/utils/html-parser.tsx:L14-L16'
---

<!-- context:generated:start -->

## Summary

Google Translate can crash React apps by injecting attributes into text nodes; html-parser.tsx mitigates this by wrapping non-empty text nodes in span elements before parsing, preventing the translation tool from corrupting the component tree. This is a defensive workaround that must always precede html-react-parser consumption throughout the codebase.

## Related

- part of [[platform-app-utilities]] — The workaround is encapsulated in the htmlSafeParse function

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
