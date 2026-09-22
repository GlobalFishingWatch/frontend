---
name: Workspace and Project Configuration
slug: workspace-and-project-configuration
type: system
sources:
  - path: apps/track-labeler/src/routes/routes.selectors.ts
    hash: e67b5eafc2aeae134265ca2925a8193bfd69bbac2e647535a2caefb10b97b177
sources_digest: dc82c58286e6db24e980e4abb63b42d7605b4b495f8fa31bafada927cabcad79
links:
  - to: activity-type-ontology
    relation: uses
    description: >-
      Projects define custom label colors that override global TRACK_COLORS for
      rendering; selectProjectColors merges project and global colors
  - to: query-driven-state-synchronization
    relation: configures
    description: >-
      Project configuration supplies defaults like DEFAULT_WORKSPACE; query
      parameters select active projects and filters
  - to: track-labeler-user-authentication
    relation: depends_on
    description: >-
      User permissions gates access to projects; hooks filter project list based
      on user's LABELER_LOAD_PERMISSION
generator:
  version: 1
covers:
  - symbol: selectLocation
    kind: function
    at: 'apps/track-labeler/src/routes/routes.selectors.ts:L11-L13'
  - symbol: selectQueryParam
    kind: function
    at: 'apps/track-labeler/src/routes/routes.selectors.ts:L22-L28'
---

<!-- context:generated:start -->

## Summary

Centralizes project definitions (metadata, labels, display options, available filters) and workspace defaults. Projects can override global activity colors; views default to a home workspace when no project is selected.

## Related

- uses [[activity-type-ontology]] — Projects define custom label colors that override global TRACK_COLORS for rendering; selectProjectColors merges project and global colors
- configures [[query-driven-state-synchronization]] — Project configuration supplies defaults like DEFAULT_WORKSPACE; query parameters select active projects and filters
- depends on [[track-labeler-user-authentication]] — User permissions gates access to projects; hooks filter project list based on user's LABELER_LOAD_PERMISSION

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
