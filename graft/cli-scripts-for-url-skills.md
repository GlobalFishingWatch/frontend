---
name: CLI Scripts for URL Skills
slug: cli-scripts-for-url-skills
type: system
sources:
  - path: libs/skills/src/decode-url/scripts/decode-url.mjs
    hash: 6e52e775b1ad5d3f2b6c639c2b2ed85e41a67fbd0753b835161fbd0ae4d87d71
  - path: libs/skills/src/encode-url/scripts/encode-url.mjs
    hash: 1dda4ba5ce4d7caab5c908e995892853a3baeec0646a6bf4bccacd41d8a8f2d1
sources_digest: 2260da3578ac35e90f3331e753d09fdef1d0112f772991f35cc897b8b63e4587
links:
  - to: custom-module-resolution-for-skills
    relation: depends_on
    description: >-
      Both scripts import register-gfw-resolver.mjs to enable
      @globalfishingwatch/skills/<skillName> imports
generator:
  version: 1
covers:
  - symbol: readStdin
    kind: function
    at: 'libs/skills/src/encode-url/scripts/encode-url.mjs:L4-L8'
---

<!-- context:generated:start -->

## Summary

Provides command-line interfaces for URL encoding/decoding: encode-url.mjs and decode-url.mjs accept URL or state JSON from args or stdin, invoke the respective skill functions, and output formatted JSON to stdout with error handling and exit codes.

## Related

- depends on [[custom-module-resolution-for-skills]] — Both scripts import register-gfw-resolver.mjs to enable @globalfishingwatch/skills/<skillName> imports

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
