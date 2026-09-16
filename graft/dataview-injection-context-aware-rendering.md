---
name: Dataview Injection & Context-Aware Rendering
slug: dataview-injection-context-aware-rendering
type: concept
sources:
  - path: >-
      apps/platform/features/_map/dataviews/selectors/dataviews.injected.selectors.ts
    hash: 5e83895c9b427431b138d7682fdeab5a22b2ece06a9670c41284ebefb9644626
  - path: >-
      apps/platform/features/_map/dataviews/selectors/dataviews.injected.utils.ts
    hash: e14d18fdadd44e2729c8656419a6cb63938ff81f545fec12ae0d0935ca54a9d6
  - path: >-
      apps/platform/features/_map/dataviews/selectors/dataviews.merged.selectors.ts
    hash: 2d4f2dc61805197cd8d1c14a047a54245d8621a5e199bf1db3aa79fbed0b3f18
sources_digest: 072cabd09520ef4308db7a3300a0e4af625687da0b61ce96931e9b12a1e9940e
links:
  - to: circular-dependency-breaking
    relation: depends_on
    description: >-
      dataviews.merged.selectors lives in its own module to break cycles:
      dataviews.injected and dataviews.resolver both depend on it, and both need
      to avoid importing each other directly.
  - to: dataview-instance-resolution-pipeline
    relation: part_of
    description: >-
      Injected dataviews are merged with workspace instances early in the
      resolution pipeline and filtered out during workspace persistence to
      prevent duplication bugs.
  - to: report-aware-dataview-filtering
    relation: uses
    description: >-
      Injected selector logic branches on location type (vessel profile vs.
      report types) which is checked by visibility filtering and report category
      extraction.
generator:
  version: 1
covers:
  - symbol: getIsInjectedDataview
    kind: function
    at: >-
      apps/platform/features/_map/dataviews/selectors/dataviews.injected.utils.ts:L21-L44
---

<!-- context:generated:start -->

## Summary

Dynamically generated dataviews for reporting contexts (vessel profiles, vessel group reports, port reports, area reports) are injected at render time rather than persisted in workspace state, marked with `injected: true` to distinguish from user-configured layers. These selectors conditionally compose instances based on URL state (vessel ID, report type, port ID) and automatically resolve colors, encounter tracks with time windows, and dataset-specific variants (AIS vs. VMS) without duplication.

## Related

- depends on [[circular-dependency-breaking]] — dataviews.merged.selectors lives in its own module to break cycles: dataviews.injected and dataviews.resolver both depend on it, and both need to avoid importing each other directly.
- part of [[dataview-instance-resolution-pipeline]] — Injected dataviews are merged with workspace instances early in the resolution pipeline and filtered out during workspace persistence to prevent duplication bugs.
- uses [[report-aware-dataview-filtering]] — Injected selector logic branches on location type (vessel profile vs. report types) which is checked by visibility filtering and report category extraction.

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
