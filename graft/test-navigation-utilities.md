---
name: Test Navigation Utilities
slug: test-navigation-utilities
type: system
sources:
  - path: apps/platform/test/utils/navigation/addVesselToWorkspace.ts
    hash: fa90618d444fddf6841f635efb6cd5fda88fc51e11c325a5c790630ee9a6b585
  - path: apps/platform/test/utils/navigation/navigateToComparisonReport.ts
    hash: eb67e2f7f0846babc3b50399cbc62491c70e1c1f036260c764248538c55e7d4d
  - path: apps/platform/test/utils/navigation/navigateToFijiWorkspace.ts
    hash: 361f7b1451b89b9f13f94683ffea51e4d105da63e61d6b9e041f41902f663c92
  - path: apps/platform/test/utils/navigation/navigateToGlobalReport.ts
    hash: 21d4eeb514cd66f481fc80efff6ed06372cdc1683f88cea89ca42f0e0cece289
  - path: apps/platform/test/utils/navigation/navigateToHelpHub.ts
    hash: 01536b87d21fcc2bc839e323511354b0c83bd5664ddbd61b2bf750bf44191272
  - path: apps/platform/test/utils/navigation/navigateToHelpHubSection.ts
    hash: 6bb37e04cbc3386ca499b4b4b4c89b5eb72de072efac3c9698ba41efcfa9dfd1
  - path: apps/platform/test/utils/navigation/navigateToNoDataReport.ts
    hash: 73ff6e8315aef1f4ef2658532e968fc83f95ae6d6a0b41d31cbe1c8702e3497e
  - path: apps/platform/test/utils/navigation/navigateToPolygonEditor.ts
    hash: 28bf1f5f45d22fab48dba10168177469dd3156f497bb382994aa91179e9f49df
  - path: apps/platform/test/utils/navigation/navigateToPrivateWorkspace.ts
    hash: d98a668b44747da5a786027451e20f34bef166cc938753a57668bb625f2a6523
  - path: apps/platform/test/utils/navigation/navigateToReportByArea.ts
    hash: 300206e669bf1d1fcfa866955ae9d19062480e5c5b9c1376c1ed213799f36494
  - path: apps/platform/test/utils/navigation/navigateToUserReport.ts
    hash: d0ee99bc31176d1bb8f503e02205ef6c150c868a9f19e4c27eeeb37ff725d754
  - path: apps/platform/test/utils/navigation/navigateToVesselSearch.ts
    hash: e81835bd430694e64c4f29ab75684c387ee6d5487a72ec052e8c720642d4cec2
  - path: apps/platform/test/utils/navigation/navigateToVesselViewer.ts
    hash: b00f293804d33e7ea222bff6a7739b720e807630ccce6365db7fd64c8fa81831
  - path: apps/platform/test/utils/navigation/navigateToWorkspace01.ts
    hash: 4807d80ae02314d186fc3566166ea17c15ff4626a8a3d9e03c4a92f8c5edaf64
  - path: apps/platform/test/utils/navigation/navigateToWorkspace02.ts
    hash: e8a0938a32b757a61c99e59778457defeb8d9f5b0cdbc18bb3ee7e7c8949f44f
sources_digest: aabf87b16f5717df17ae0ec81830970ce272a60e6199b9ac8b95b53c384559a4
links:
  - to: navigation-type-safety
    relation: implements
    description: >-
      All navigation fixtures return NavigationConfig objects typed against the
      application's router
generator:
  version: 1
covers:
  - symbol: addVesselToWorkspace
    kind: function
    at: 'apps/platform/test/utils/navigation/addVesselToWorkspace.ts:L5-L45'
  - symbol: navigateToComparisonReport
    kind: function
    at: 'apps/platform/test/utils/navigation/navigateToComparisonReport.ts:L5-L32'
  - symbol: navigateToFijiWorkspace
    kind: function
    at: 'apps/platform/test/utils/navigation/navigateToFijiWorkspace.ts:L12-L22'
  - symbol: getRouteToFijiWorkspaceWithAllLayers
    kind: function
    at: 'apps/platform/test/utils/navigation/navigateToFijiWorkspace.ts:L24-L58'
  - symbol: navigateToGlobalReport
    kind: function
    at: 'apps/platform/test/utils/navigation/navigateToGlobalReport.ts:L5-L32'
  - symbol: navigateToHelpHub
    kind: function
    at: 'apps/platform/test/utils/navigation/navigateToHelpHub.ts:L5-L9'
  - symbol: HelpHubSectionParams
    kind: type
    at: 'apps/platform/test/utils/navigation/navigateToHelpHubSection.ts:L6-L10'
  - symbol: navigateToHelpHubSection
    kind: function
    at: 'apps/platform/test/utils/navigation/navigateToHelpHubSection.ts:L12-L21'
  - symbol: navigateToNoDataReport
    kind: function
    at: 'apps/platform/test/utils/navigation/navigateToNoDataReport.ts:L5-L34'
  - symbol: navigateToPolygonEditor
    kind: function
    at: 'apps/platform/test/utils/navigation/navigateToPolygonEditor.ts:L7-L35'
  - symbol: navigateToPrivateWorkspace
    kind: function
    at: 'apps/platform/test/utils/navigation/navigateToPrivateWorkspace.ts:L5-L17'
  - symbol: DatasetId
    kind: type
    at: 'apps/platform/test/utils/navigation/navigateToReportByArea.ts:L21-L21'
  - symbol: EEZNames
    kind: type
    at: 'apps/platform/test/utils/navigation/navigateToReportByArea.ts:L28-L28'
  - symbol: MPANames
    kind: type
    at: 'apps/platform/test/utils/navigation/navigateToReportByArea.ts:L30-L30'
  - symbol: RFMONames
    kind: type
    at: 'apps/platform/test/utils/navigation/navigateToReportByArea.ts:L32-L32'
  - symbol: navigateToReport
    kind: function
    at: 'apps/platform/test/utils/navigation/navigateToReportByArea.ts:L35-L53'
  - symbol: ReportArea
    kind: type
    at: 'apps/platform/test/utils/navigation/navigateToReportByArea.ts:L55-L55'
  - symbol: navigateToReportByArea
    kind: function
    at: 'apps/platform/test/utils/navigation/navigateToReportByArea.ts:L56-L67'
  - symbol: navigateToUserReportsTab
    kind: function
    at: 'apps/platform/test/utils/navigation/navigateToUserReport.ts:L6-L14'
  - symbol: navigateToUserReport
    kind: function
    at: 'apps/platform/test/utils/navigation/navigateToUserReport.ts:L16-L27'
  - symbol: navigateToVesselSearch
    kind: function
    at: 'apps/platform/test/utils/navigation/navigateToVesselSearch.ts:L6-L24'
  - symbol: VesselViewerParams
    kind: type
    at: 'apps/platform/test/utils/navigation/navigateToVesselViewer.ts:L8-L14'
  - symbol: navigateToVesselViewer
    kind: function
    at: 'apps/platform/test/utils/navigation/navigateToVesselViewer.ts:L16-L46'
  - symbol: navigateToWorkspace01
    kind: function
    at: 'apps/platform/test/utils/navigation/navigateToWorkspace01.ts:L6-L22'
  - symbol: navigateToWorkspace02
    kind: function
    at: 'apps/platform/test/utils/navigation/navigateToWorkspace02.ts:L6-L22'
---

<!-- context:generated:start -->

## Summary

Test fixtures for programmatically navigating to application routes with preconfigured state. These utilities construct NavigationConfig objects (TypeScript-safe route + parameters combinations) to avoid manual route string concatenation and ensure consistent test setup across workspace, map, vessel, and report views.

## Related

- implements [[navigation-type-safety]] — All navigation fixtures return NavigationConfig objects typed against the application's router

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
