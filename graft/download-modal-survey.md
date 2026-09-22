---
name: Download Modal & Survey
slug: download-modal-survey
type: system
sources:
  - path: apps/data-download-portal/src/components/download-modal/download-modal.tsx
    hash: 38a0f3da9f34dd1111f4ba2007a63f149d98cc12cf230e14431a406af017ded0
sources_digest: b3037154abf4b116078db7022f4759585d8b6984bd7c781186dc866aebe32f67
links:
  - to: data-portal-configuration
    relation: depends_on
    description: Respects DISABLE_DOWNLOAD_SURVEY and DOWNLOAD_SURVEY_URL config
generator:
  version: 1
covers:
  - symbol: DownloadRequest
    kind: type
    at: >-
      apps/data-download-portal/src/components/download-modal/download-modal.tsx:L19-L22
  - symbol: DownloadModalProps
    kind: type
    at: >-
      apps/data-download-portal/src/components/download-modal/download-modal.tsx:L24-L29
  - symbol: DownloadModal
    kind: function
    at: >-
      apps/data-download-portal/src/components/download-modal/download-modal.tsx:L31-L63
---

<!-- context:generated:start -->

## Summary

Modal dialog for post-download feedback collection. Conditionally renders survey form or simple notification based on download type; handles survey submission and multi-file email delivery messaging.

## Related

- depends on [[data-portal-configuration]] — Respects DISABLE_DOWNLOAD_SURVEY and DOWNLOAD_SURVEY_URL config

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
