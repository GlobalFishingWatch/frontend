---
name: Sitemap Generation Script
slug: sitemap-generation-script
type: file
sources:
  - path: apps/platform/scripts/generate-vessel-sitemap.mjs
    hash: 1dc89e5c9bcb7b089dcbb89a56d240d9ba3149b4a70b2f6f1a52afab1c08c60c
sources_digest: 80da97258b8374710736eda4d3cce47c790ade593dcfc86b7dccf0b784188525
links: []
generator:
  version: 1
covers:
  - symbol: splitCsvLine
    kind: function
    at: 'apps/platform/scripts/generate-vessel-sitemap.mjs:L28-L49'
  - symbol: xmlEscape
    kind: function
    at: 'apps/platform/scripts/generate-vessel-sitemap.mjs:L109-L109'
  - symbol: shardName
    kind: function
    at: 'apps/platform/scripts/generate-vessel-sitemap.mjs:L110-L110'
  - symbol: mb
    kind: function
    at: 'apps/platform/scripts/generate-vessel-sitemap.mjs:L140-L140'
---

<!-- context:generated:start -->

## Summary

Node.js CLI script (generate-vessel-sitemap.mjs) that processes GFW CSV vessel data, deduplicates by vesselId, sorts by presence hours, and outputs XML sitemaps split into 50k-URL shards with gzip compression. Excludes specific vessel/gear types and escapes XML entities.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
