---
name: Clipboard Utility
slug: clipboard-utility
type: file
sources:
  - path: apps/platform/utils/clipboard.ts
    hash: 9a60273d8ebe3a2600543ce525cdd59f56dd4fb20e142d27b1778c8e569cb854
sources_digest: e866a09003a6825c005f6b56cc48299b45a9ac747ff3f0dfa901d35b43ea6471
links: []
generator:
  version: 1
covers:
  - symbol: copyToClipboard
    kind: function
    at: 'apps/platform/utils/clipboard.ts:L1-L9'
---

<!-- context:generated:start -->

## Summary

Cross-browser fallback mechanism for copying text to clipboard using the deprecated document.execCommand('copy') API. Creates a hidden input element, populates it, and triggers the copy operation. Lacks error handling and should be replaced with modern Clipboard API in production.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
