---
name: Icon Atlas Generation
slug: icon-atlas-generation
type: system
sources:
  - path: libs/deck-layers/scripts/generate-icon-atlas.js
    hash: 0dc7a9c043c0c17f8b2f13963f42430fc6662821f952eb61e28b5565c15a4f51
sources_digest: 205007228b0fba5d8e963c9970f69c2929bc6e916c0583960728b182a990ffbc
links: []
generator:
  version: 1
covers:
  - symbol: parseArgs
    kind: function
    at: 'libs/deck-layers/scripts/generate-icon-atlas.js:L39-L47'
  - symbol: getImageFiles
    kind: function
    at: 'libs/deck-layers/scripts/generate-icon-atlas.js:L49-L67'
  - symbol: getImageInfo
    kind: function
    at: 'libs/deck-layers/scripts/generate-icon-atlas.js:L69-L77'
  - symbol: createSpritesheet
    kind: function
    at: 'libs/deck-layers/scripts/generate-icon-atlas.js:L79-L126'
  - symbol: generateIconAtlas
    kind: function
    at: 'libs/deck-layers/scripts/generate-icon-atlas.js:L128-L186'
---

<!-- context:generated:start -->

## Summary

Node.js script that generates sprite atlases from individual PNG files, producing both bitmap images and JSON metadata for deck.gl IconLayer usage with coordinate mapping and anchor point configuration.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
