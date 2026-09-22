---
name: Navigation Guards
slug: navigation-guards
type: system
sources:
  - path: apps/platform/router/ConfirmLeave.tsx
    hash: a16bb3e4719f506f63ddd1f2c7fed5c90a3473d6b8edf5827bd6dc0987aa1193
  - path: apps/platform/router/ConfirmVesselProfileLeave.tsx
    hash: 3bc2dd04aa0a6da974a007a53d9d5f36291e093e1ab9a5051db96b746bb4ed9b
sources_digest: 1d093be763e7650e4dd5d9d206087676fbfd24afb8a054db1a4524741c71cfa9
links:
  - to: location-state
    relation: depends_on
    description: >-
      Both query Redux state to determine if unsaved workspace changes exist and
      route type
  - to: router-core
    relation: uses
    description: Both use TanStack Router's useBlocker hook to intercept navigation events
generator:
  version: 1
covers:
  - symbol: ConfirmLeave
    kind: function
    at: 'apps/platform/router/ConfirmLeave.tsx:L13-L57'
  - symbol: ConfirmVesselProfileLeave
    kind: function
    at: 'apps/platform/router/ConfirmVesselProfileLeave.tsx:L21-L93'
---

<!-- context:generated:start -->

## Summary

Pair of React components (ConfirmLeave, ConfirmVesselProfileLeave) that intercept TanStack Router navigation via useBlocker hook to prevent accidental data loss. ConfirmLeave guards workspace-editing routes when unsaved changes exist and user is authenticated. ConfirmVesselProfileLeave guards vessel profile exit by offering to pin/clean/remove the dataview instance. Both write to sessionStorage and dispatch StorageEvents on decline to signal auto-save, with graceful handling for restricted/sandboxed environments.

## Related

- depends on [[location-state]] — Both query Redux state to determine if unsaved workspace changes exist and route type
- uses [[router-core]] — Both use TanStack Router's useBlocker hook to intercept navigation events

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
