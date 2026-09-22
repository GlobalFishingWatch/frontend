---
name: Toolbar & Tool Components
slug: toolbar-tool-components
type: system
sources:
  - path: libs/timebar/src/components/tool-wrapper.tsx
    hash: f00d54091df60c6b3efe5f30e408b95b77c260edf5b5628329e8b0434e34fbdb
  - path: libs/timebar/src/components/toolbar-wrapper.tsx
    hash: ca63de00e254a4c55e80ac86d4e8acce6838d561939bd7a03003de9ce520d975
sources_digest: 2128c0bf5cc4664ab96e531f1cb24df0e990b6ab47a624a329d683c3f6c47b9c
links:
  - to: timebar-main-component
    relation: implements
    description: >-
      Toolbar and tool wrappers are used to render Timebar.ToolbarWrapper and
      Timebar.Tools.* child components
generator:
  version: 1
covers:
  - symbol: TimebarToolWrapper
    kind: function
    at: 'libs/timebar/src/components/tool-wrapper.tsx:L6-L25'
  - symbol: TimebarToolbarWrapper
    kind: function
    at: 'libs/timebar/src/components/toolbar-wrapper.tsx:L6-L8'
---

<!-- context:generated:start -->

## Summary

Presentational wrapper components standardizing button and toolbar styling in the timebar UI. TimebarToolWrapper renders individual tool buttons with conditional interactivity (noAction style when no onClick); TimebarToolbarWrapper containers a group of tools with consistent print-hiding and layout. These are low-level styling abstractions with no logic.

## Related

- implements [[timebar-main-component]] — Toolbar and tool wrappers are used to render Timebar.ToolbarWrapper and Timebar.Tools.* child components

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
