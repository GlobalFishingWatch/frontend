---
name: Workspace & Layer Library Defaults
slug: workspace-layer-library-defaults
type: system
sources:
  - path: apps/platform/data/map/default-workspaces/context-layers.ts
    hash: 454492939aba4543b352d194545867a24baef5db2ae9d070aca1b2b08eddef15
  - path: apps/platform/data/map/default-workspaces/workspace.development.ts
    hash: 6158a8b402cd2b50f4d6eb2b47c32a3db55e0cf2a598d5e9258e98e702a9df3a
  - path: apps/platform/data/map/default-workspaces/workspace.production.ts
    hash: 16918cc9d574d7136cbcc1a797ea4517744dd302ae0d567069175f2b4d406f14
  - path: apps/platform/data/map/default-workspaces/workspace.staging.ts
    hash: eeab9f43da76ca9f5a7bf59579a886b0d729834461cda0c064eecb32e68ca829
  - path: apps/platform/data/map/highlighted-workspaces/marine-manager.dataviews.ts
    hash: 752adb931de034723625ac47406b717c9b337c80384502ec271067f30b32f4e8
  - path: apps/platform/data/map/highlighted-workspaces/marine-manager.ts
    hash: bec2ad0a2a1a35915ff0249fbad756b970568ecf5cb1548328ca73123bbbe7bd
  - path: apps/platform/data/map/highlighted-workspaces/report.dataviews.ts
    hash: 3e259a976eba6f11803f378c823d8881962cd06d1f5135eeb9e9b3680a178fe2
  - path: apps/platform/data/map/highlighted-workspaces/reports.ts
    hash: ff806dc44a8df7d2ab3a461dafef7133c2271f0ac8b3cd9ac656ef7bb71e7f44
  - path: apps/platform/data/map/layer-library/index.ts
    hash: c0e13420b42069939dd480636b72c9afd9022ac9e4b5ff2b2961e4b780a478e4
  - path: apps/platform/data/map/layer-library/layers-activity.ts
    hash: 020eea3076f57b462342500123abdf3d8f069ee8d56ade76bae3aeaa64a289ad
  - path: apps/platform/data/map/layer-library/layers-context.ts
    hash: 34ee8a12a3fc15eff105497451e0053bbb14e0350cfbaacd5c5e1cbc2df03290
  - path: apps/platform/data/map/layer-library/layers-detections.ts
    hash: d621aeddaa767c6df2d56ac63ddad514c239d360495239982c2c83638541dc58
  - path: apps/platform/data/map/layer-library/layers-environment.ts
    hash: 914be777edbfb172a5829c143c57598b15d8dd9e375ab81fc95dc54f58f09a39
  - path: apps/platform/data/map/layer-library/layers-events.ts
    hash: 06c3a557316a6691966a882a412947f6885d6502533a25365f025ad84c6ed5f5
sources_digest: c092e6b161d45a0ef4992017c59d18838dceb54cd3e9a9da9949e50ec94b1552
links:
  - to: map-configuration-styling
    relation: uses
    description: >-
      Default workspaces reference layer IDs, port/infrastructure constants, and
      spatial filter values from map-specific config
  - to: map-dataview-registry
    relation: uses
    description: >-
      Workspace and layer library modules reference dataview registry
      collections and individual slug constants to populate layer instances
  - to: platform-configuration
    relation: depends_on
    description: >-
      Default workspaces consume viewport, time range, workspace ID, and
      dataview slug constants from config modules
  - to: workspace-visibility-layer-filtering-logic
    relation: implements
    description: >-
      Workspace instances specify which layers are visible by default, which are
      hidden for later user activation, and filtering rules (port distance, area
      boundaries)
generator:
  version: 1
covers:
  - symbol: MarineManagerWorkspaceId
    kind: type
    at: 'apps/platform/data/map/highlighted-workspaces/marine-manager.ts:L6-L6'
  - symbol: MarineManagerWorkspace
    kind: type
    at: 'apps/platform/data/map/highlighted-workspaces/marine-manager.ts:L7-L12'
  - symbol: ReportWorkspaceId
    kind: type
    at: 'apps/platform/data/map/highlighted-workspaces/reports.ts:L14-L14'
  - symbol: WorkspaceReportLink
    kind: type
    at: 'apps/platform/data/map/highlighted-workspaces/reports.ts:L15-L17'
  - symbol: ReportWorkspace
    kind: type
    at: 'apps/platform/data/map/highlighted-workspaces/reports.ts:L18-L33'
---

<!-- context:generated:start -->

## Summary

Configurations that seed the map with initial dataview instances, layer visibility states, and filters. Includes environment-specific default workspaces (development, production, staging), specialized highlighted workspaces (Marine Manager, Reports), and layered library definitions (activity, context, detections, environment, events). All layer instances reference configuration constants and dataview slugs.

## Related

- uses [[map-configuration-styling]] — Default workspaces reference layer IDs, port/infrastructure constants, and spatial filter values from map-specific config
- uses [[map-dataview-registry]] — Workspace and layer library modules reference dataview registry collections and individual slug constants to populate layer instances
- depends on [[platform-configuration]] — Default workspaces consume viewport, time range, workspace ID, and dataview slug constants from config modules
- implements [[workspace-visibility-layer-filtering-logic]] — Workspace instances specify which layers are visible by default, which are hidden for later user activation, and filtering rules (port distance, area boundaries)

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
