---
name: Workspace Layout & UI Utilities
slug: workspace-layout-ui-utilities
type: system
sources:
  - path: apps/platform/features/_map/workspace/ErrorPlaceholder.tsx
    hash: 3ee35eaf73c9e3d49c315d19b238bbc3fc2b81a503eb10cc2401174e466da3f5
sources_digest: 7d5fa0593816c935664e95d3123d6f0426611c375343dd7636537c084479aa51
links:
  - to: activity-dataview-management-system
    relation: part_of
    description: >-
      ErrorPlaceholder and shared UI utilities support activity layer panel
      rendering
  - to: environmental-layer-management-system
    relation: part_of
    description: >-
      Shared components support environmental layer panel rendering and feature
      list UI
  - to: events-layer-management
    relation: part_of
    description: Shared UI components support event layer panel controls
generator:
  version: 1
covers:
  - symbol: ErrorPlaceholderProps
    kind: interface
    at: 'apps/platform/features/_map/workspace/ErrorPlaceholder.tsx:L5-L9'
  - symbol: ErrorPlaceholder
    kind: function
    at: 'apps/platform/features/_map/workspace/ErrorPlaceholder.tsx:L11-L20'
---

<!-- context:generated:start -->

## Summary

Provides shared UI components and styling for the map workspace feature. ErrorPlaceholder renders centered error/empty state messages with optional children and custom styling. Title component (imported from workspace utilities) handles layer panel titles. LayerSwitch, LayerProperties, LayerFilters, and Remove components manage layer-specific controls (visibility, color, filtering, deletion). Shared styling via Workspace.module.css and LayerFilters.module.css ensures visual consistency. Classnames utility enables conditional styling across panels.

## Related

- part of [[activity-dataview-management-system]] — ErrorPlaceholder and shared UI utilities support activity layer panel rendering
- part of [[environmental-layer-management-system]] — Shared components support environmental layer panel rendering and feature list UI
- part of [[events-layer-management]] — Shared UI components support event layer panel controls

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
