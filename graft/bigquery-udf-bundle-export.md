---
name: BigQuery UDF Bundle Export
slug: bigquery-udf-bundle-export
type: file
sources:
  - path: libs/dataviews-client/esbuild.url.ts
    hash: 0933c419e3563f86cf00577da810ec3ad1279ad3ec07c07bcbba9c71bba2a6da
sources_digest: 60b2db4522647fbeab0a533e0ef59369cda1fb84e619215337c77b3d0154d6e2
links:
  - to: dataview-url-workspace
    relation: uses
    description: >-
      Bundles url-workspace module for cross-platform URL parsing outside
      browser/Node.js
generator:
  version: 1
covers:
  - symbol: buildBundle
    kind: function
    at: 'libs/dataviews-client/esbuild.url.ts:L3-L64'
---

<!-- context:generated:start -->

## Summary

Esbuild configuration that bundles the url-workspace module into a self-contained JavaScript IIFE for BigQuery User-Defined Functions. Includes a require stub for missing Node.js built-ins and aliases datasets-client imports for sandboxed execution.

## Related

- uses [[dataview-url-workspace]] — Bundles url-workspace module for cross-platform URL parsing outside browser/Node.js

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
