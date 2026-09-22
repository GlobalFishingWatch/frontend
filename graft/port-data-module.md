---
name: Port Data Module
slug: port-data-module
type: concept
sources:
  - path: apps/platform/utils/ports.ts
    hash: 5d53d0dc9f3f8288131f4f2890896abd952ebb52eb2086c42532d0a646b4884f
sources_digest: 4d2999aaee687b962547a2635854ea7162c18935aa7e944fdc41206e8e226ce2
links:
  - to: port-lazy-loading-caching
    relation: part_of
    description: Port data is consumed through dynamic import by loadPorts
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

External data source (data/ports) containing port definitions that are dynamically imported and cached by the Port Lazy Loading system. This module is treated as a remote asset that may not be immediately available at startup.

## Related

- part of [[port-lazy-loading-caching]] — Port data is consumed through dynamic import by loadPorts

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
