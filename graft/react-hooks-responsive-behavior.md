---
name: React Hooks Responsive Behavior
slug: react-hooks-responsive-behavior
type: concept
sources:
  - path: libs/react-hooks/src/use-navigator-online/use-navigator-online.ts
    hash: acac4089fc5e8ef16ed516fb285c20adb7d8b31862dd3cd40dfadeef9b6d647f
  - path: libs/react-hooks/src/use-page-visibility/use-page-visibility.ts
    hash: add84d9d4ba200eca7ee084546d3a150a975aa311e3b46d2f3a26297af08d77c
  - path: libs/react-hooks/src/use-print-size/use-print-size.ts
    hash: 0bcf36ca9b502100416a30cfd0c765089395ddc018eaa1658370431513177bf9
  - path: libs/react-hooks/src/use-small-screen/use-small-screen.ts
    hash: 6476911c76e4c2d4b4bad9798f98ef0418057cecb1a70d3d5b321c9193f2bb4a
sources_digest: 3d460ffada8ad8a7aef108633af8acaa2c87afa1b28b0c4ebed473bff82a3115
links: []
generator:
  version: 1
covers:
  - symbol: useNavigatorOnline
    kind: function
    at: 'libs/react-hooks/src/use-navigator-online/use-navigator-online.ts:L3-L28'
  - symbol: setOnline
    kind: function
    at: 'libs/react-hooks/src/use-navigator-online/use-navigator-online.ts:L6-L8'
  - symbol: setOffline
    kind: function
    at: 'libs/react-hooks/src/use-navigator-online/use-navigator-online.ts:L9-L11'
  - symbol: usePageVisibility
    kind: function
    at: 'libs/react-hooks/src/use-page-visibility/use-page-visibility.ts:L3-L25'
  - symbol: getCSSVarValue
    kind: function
    at: 'libs/react-hooks/src/use-print-size/use-print-size.ts:L3-L8'
  - symbol: PrintSizeUnit
    kind: type
    at: 'libs/react-hooks/src/use-print-size/use-print-size.ts:L19-L22'
  - symbol: PrintSize
    kind: type
    at: 'libs/react-hooks/src/use-print-size/use-print-size.ts:L23-L23'
  - symbol: getPrintSize
    kind: function
    at: 'libs/react-hooks/src/use-print-size/use-print-size.ts:L25-L29'
  - symbol: usePrintSize
    kind: function
    at: 'libs/react-hooks/src/use-print-size/use-print-size.ts:L31-L52'
  - symbol: UseSmallScreenOptions
    kind: interface
    at: 'libs/react-hooks/src/use-small-screen/use-small-screen.ts:L6-L9'
  - symbol: getMediaQueryList
    kind: function
    at: 'libs/react-hooks/src/use-small-screen/use-small-screen.ts:L15-L22'
  - symbol: useSmallScreen
    kind: function
    at: 'libs/react-hooks/src/use-small-screen/use-small-screen.ts:L24-L54'
  - symbol: report
    kind: function
    at: 'libs/react-hooks/src/use-small-screen/use-small-screen.ts:L47-L47'
---

<!-- context:generated:start -->

## Summary

Browser API integrations enabling responsive UI: useSmallScreen monitors MediaQueryList with useSyncExternalStore and module-level cache to avoid duplicate registrations; usePageVisibility tracks visibility state and detects first-time-visible transitions; useNavigatorOnline subscribes to online/offline events; usePrintSize reads CSS variables and calculates print dimensions accounting for device pixel ratio and timebar offset. Design favors referential stability and prevents memory leaks through proper cleanup.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
