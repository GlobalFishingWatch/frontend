---
name: Port Lazy Loading & Caching
slug: port-lazy-loading-caching
type: system
sources:
  - path: apps/platform/utils/ports.ts
    hash: 5d53d0dc9f3f8288131f4f2890896abd952ebb52eb2086c42532d0a646b4884f
sources_digest: 4d2999aaee687b962547a2635854ea7162c18935aa7e944fdc41206e8e226ce2
links:
  - to: i18n-system
    relation: depends_on
    description: >-
      Uses i18n translation functions for flag/language formatting via
      features/i18n
  - to: port-data-module
    relation: depends_on
    description: Dynamically imports port dataset from data/ports on first access
  - to: vessel-info-formatting
    relation: uses
    description: >-
      Calls formatInfoField to transform raw PortData into display-ready Port
      objects
generator:
  version: 1
covers:
  - symbol: Port
    kind: type
    at: 'apps/platform/utils/ports.ts:L7-L7'
  - symbol: PortData
    kind: type
    at: 'apps/platform/utils/ports.ts:L8-L8'
  - symbol: loadPorts
    kind: function
    at: 'apps/platform/utils/ports.ts:L14-L23'
  - symbol: subscribe
    kind: function
    at: 'apps/platform/utils/ports.ts:L25-L30'
  - symbol: usePorts
    kind: function
    at: 'apps/platform/utils/ports.ts:L32-L44'
  - symbol: parsePort
    kind: function
    at: 'apps/platform/utils/ports.ts:L46-L52'
  - symbol: getPortsByIds
    kind: function
    at: 'apps/platform/utils/ports.ts:L54-L61'
  - symbol: getPorts
    kind: function
    at: 'apps/platform/utils/ports.ts:L65-L65'
---

<!-- context:generated:start -->

## Summary

Manages async loading and memoization of port data through a subscription-based external store pattern. The loadPorts function dynamically imports port definitions, caches them globally, and notifies subscribers; the usePorts hook integrates with React to track load state; and getPortsByIds/getPorts retrieve and parse ports with language-aware formatting.

## Related

- depends on [[i18n-system]] — Uses i18n translation functions for flag/language formatting via features/i18n
- depends on [[port-data-module]] — Dynamically imports port dataset from data/ports on first access
- uses [[vessel-info-formatting]] — Calls formatInfoField to transform raw PortData into display-ready Port objects

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
