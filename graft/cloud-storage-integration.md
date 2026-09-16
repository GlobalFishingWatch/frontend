---
name: Cloud Storage Integration
slug: cloud-storage-integration
type: file
sources:
  - path: libs/ocean-areas/src/scripts/lib/storage.ts
    hash: 7f7058304c5de799304d2eb8df5888a4e8fa55d76b3b8e61b741bb54bb7b787f
sources_digest: 73402513a29d28a4bba48830cf255bda584bd57883d4051449f071a9c7301c8e
links: []
generator:
  version: 1
covers:
  - symbol: downloadFolder
    kind: function
    at: 'libs/ocean-areas/src/scripts/lib/storage.ts:L11-L56'
---

<!-- context:generated:start -->

## Summary

Wraps gsutil CLI for downloading remote GeoJSON datasets from Google Cloud Storage. Spawns subprocess with parallel copying, streams output in real-time, and validates GOOGLE_BUCKET_ID environment variable at module load time.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
