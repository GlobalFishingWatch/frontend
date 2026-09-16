---
name: Project Labeling Configuration
slug: project-labeling-configuration
type: system
sources:
  - path: apps/track-labeler/src/features/projects/projects.selectors.ts
    hash: 871baf9c5dd558f2bed7d08c0be91a8357ef4146fb13dd65587cd8ae767afe73
  - path: apps/track-labeler/src/features/projects/projects.slice.ts
    hash: a1a403ca9d15028660f0058309e742d697ba1e01df9b6068d9ec894b3d39e397
sources_digest: 07cf0a6799d1b69bc2fe47fa3a81ded7372776c4aab6b3c7f0d2a63eaeee4e27
links:
  - to: deck-gl-layer-composition-system
    relation: produces
    description: >-
      selectLegendLabels (derived from project.labels) color-codes track points
      in Deck.GL rendering.
  - to: sidebar-segment-labeling-interface
    relation: produces
    description: >-
      Project labels populate sidebar segment dropdown selectors;
      getActionShortcuts drives keyboard hotkey bindings.
generator:
  version: 1
covers:
  - symbol: ActionShortcutsType
    kind: type
    at: 'apps/track-labeler/src/features/projects/projects.selectors.ts:L6-L8'
  - symbol: SelectedTrackType
    kind: type
    at: 'apps/track-labeler/src/features/projects/projects.slice.ts:L8-L16'
  - symbol: ProjectSlice
    kind: type
    at: 'apps/track-labeler/src/features/projects/projects.slice.ts:L18-L20'
  - symbol: selectedProject
    kind: function
    at: 'apps/track-labeler/src/features/projects/projects.slice.ts:L38-L38'
---

<!-- context:generated:start -->

## Summary

Manages active project state and available action labels. The projects.slice Redux reducer stores the current Project object (null initially). The getActionShortcuts selector derives a keyboard-to-action mapping by combining hardcoded shortcuts (u→untracked, f→fishing) with dynamically generated shortcuts from custom project labels, using a first-available-letter strategy that respects built-in action priority. Labels must be alphabetic to generate keyboard bindings; some labels may not receive shortcuts if their letters are already claimed.

## Related

- produces [[deck-gl-layer-composition-system]] — selectLegendLabels (derived from project.labels) color-codes track points in Deck.GL rendering.
- produces [[sidebar-segment-labeling-interface]] — Project labels populate sidebar segment dropdown selectors; getActionShortcuts drives keyboard hotkey bindings.

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
