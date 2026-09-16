---
name: Data Download Portal Application
slug: data-download-portal-application
type: system
sources:
  - path: apps/data-download-portal/eslint.config.js
    hash: 7e22e29146cdc143db6ff08c2f585c9a112e6058fde5483d66cfd203cc13337c
  - path: apps/data-download-portal/src/app.tsx
    hash: 099e904744dfdf02459e6981c20f275277ec415016eee4c53ddaf6d483770e5b
  - path: apps/data-download-portal/src/index.tsx
    hash: da64e3908eac1e28d3d507b528cd18f4f7966a70157a7340206824473e53da2e
sources_digest: 451cc56b4c29c9976f27627a6b94626fdad96d6d792d36de4179af17f5381996
links:
  - to: data-portal-configuration
    relation: depends_on
    description: 'Runtime config controls download limits, survey endpoints, and API gateway'
  - to: data-portal-header-auth
    relation: uses
    description: App renders header navigation and login state management
  - to: data-portal-page-routes
    relation: uses
    description: >-
      App component configures TanStack Router with auto-generated routeTree for
      home, login, report, and dataset detail pages
generator:
  version: 1
covers:
  - symbol: Register
    kind: interface
    at: 'apps/data-download-portal/src/app.tsx:L20-L22'
  - symbol: App
    kind: function
    at: 'apps/data-download-portal/src/app.tsx:L25-L31'
---

<!-- context:generated:start -->

## Summary

A React application for browsing, searching, and downloading Global Fishing Watch datasets with hierarchical file structures. Integrates authentication, dataset discovery, markdown-based readme rendering, and survey-driven download workflows.

## Related

- depends on [[data-portal-configuration]] — Runtime config controls download limits, survey endpoints, and API gateway
- uses [[data-portal-header-auth]] — App renders header navigation and login state management
- uses [[data-portal-page-routes]] — App component configures TanStack Router with auto-generated routeTree for home, login, report, and dataset detail pages

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
