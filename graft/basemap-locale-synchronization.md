---
name: Basemap Locale Synchronization
slug: basemap-locale-synchronization
type: file
sources:
  - path: apps/platform/features/_map/dataviews/BasemapLabelsLocaleSync.tsx
    hash: 89e50a9f721d6992cef1dd1fe4dc0543d05af6eb549842da464b2aa9eb5c7fad
sources_digest: 8d7be0a0fad93b99a71af33bb8197b3b7a7f353fd5eb00902e3fbe496830b708
links:
  - to: dataviews-management
    relation: uses
    description: >-
      Reads basemap dataview instance via selector and updates its locale via
      upsertDataviewInstance
generator:
  version: 1
covers:
  - symbol: BasemapLabelsLocaleSync
    kind: function
    at: 'apps/platform/features/_map/dataviews/BasemapLabelsLocaleSync.tsx:L11-L28'
---

<!-- context:generated:start -->

## Summary

React component that automatically syncs the basemap labels language with the application's i18n locale setting, handling the special case where 'source' language maps to English and avoiding redundant updates when locales already match.

## Related

- uses [[dataviews-management]] — Reads basemap dataview instance via selector and updates its locale via upsertDataviewInstance

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
