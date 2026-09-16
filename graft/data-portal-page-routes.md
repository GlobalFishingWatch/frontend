---
name: Data Portal Page Routes
slug: data-portal-page-routes
type: system
sources:
  - path: apps/data-download-portal/src/pages/dataset/dataset.tsx
    hash: a00a5179f6e6a158148e12fc31f2e820b27085525b604b822f6db87a0a1b8cf4
  - path: apps/data-download-portal/src/pages/home/home.tsx
    hash: 6e990b5baa83a64b7157d40eaa253e253c0a4746d403340391ea803cfc15b874
  - path: apps/data-download-portal/src/pages/login/login.tsx
    hash: 3a97c470db43fc145973f455097d27741b71feb087afa03b8cd75306b227218c
  - path: apps/data-download-portal/src/pages/report/report.tsx
    hash: 6ad9e6869f025d50eee19f57169e11d2e9822dc87cbf4fc7b25dfd7cc59dded5
sources_digest: 96df3387e92b65f4a2872b461f0b697dbf7f86b94ad4401c0d8035ebaf7ee67b
links:
  - to: api-banner-component
    relation: uses
    description: >-
      DatasetPage includes promotional banner directing users to API
      documentation
  - to: data-portal-header-auth
    relation: depends_on
    description: >-
      HomePage and DatasetPage gate content behind useGFWLogin state; LoginPage
      and ReportPage redirect via GFWAPI
  - to: data-portal-table-component
    relation: uses
    description: >-
      DatasetPage renders Table for hierarchical file browsing and download
      within individual datasets
  - to: enhanced-markdown-renderer
    relation: uses
    description: >-
      DatasetPage renders dataset readme via EnhancedMarkdown with collapsible
      sections
generator:
  version: 1
covers:
  - symbol: DatasetPage
    kind: function
    at: 'apps/data-download-portal/src/pages/dataset/dataset.tsx:L61-L141'
  - symbol: formatDataset
    kind: function
    at: 'apps/data-download-portal/src/pages/dataset/dataset.tsx:L71-L77'
  - symbol: HomePage
    kind: function
    at: 'apps/data-download-portal/src/pages/home/home.tsx:L25-L124'
  - symbol: handleSortClick
    kind: function
    at: 'apps/data-download-portal/src/pages/home/home.tsx:L33-L35'
  - symbol: LoginPage
    kind: function
    at: 'apps/data-download-portal/src/pages/login/login.tsx:L5-L10'
  - symbol: ReportPage
    kind: function
    at: 'apps/data-download-portal/src/pages/report/report.tsx:L10-L55'
---

<!-- context:generated:start -->

## Summary

Multi-page routing structure: HomePage for dataset discovery/search, DatasetPage for individual dataset browsing, LoginPage for auth redirect, and ReportPage for direct report downloads.

## Related

- uses [[api-banner-component]] — DatasetPage includes promotional banner directing users to API documentation
- depends on [[data-portal-header-auth]] — HomePage and DatasetPage gate content behind useGFWLogin state; LoginPage and ReportPage redirect via GFWAPI
- uses [[data-portal-table-component]] — DatasetPage renders Table for hierarchical file browsing and download within individual datasets
- uses [[enhanced-markdown-renderer]] — DatasetPage renders dataset readme via EnhancedMarkdown with collapsible sections

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
