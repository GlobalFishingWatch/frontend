---
name: CSS Modules and styling architecture
slug: css-modules-and-styling-architecture
type: concept
sources:
  - path: libs/ui-components/src/slider/slider.utils.ts
    hash: e932ecf1ebaed1bd8f628e5d083ba9bb6673117db2a7580228da621e4cba999e
  - path: libs/ui-components/src/solar-status/SolarStatus.tsx
    hash: 57411b8a5fb757a8a2dde7957663ba17fcdc525e262d516baf848f133ec8c5ef
  - path: libs/ui-components/src/spinner/Spinner.tsx
    hash: 6b0164c47113c6d5ed6fdc3a9cbfbf86d070970ed0c7f386760cb25ec15fc8af
  - path: libs/ui-components/src/split-view/SplitView.tsx
    hash: 78e07ceb2d9c59b194dec43ccbf50effcb114a45444784e4ba623e9b2b268693
  - path: libs/ui-components/src/switch-row/SwitchRow.tsx
    hash: 3ba248abd290ba837b46a87f57c035b3a27e903e12282c2ccc190964bbde2614
  - path: libs/ui-components/src/switch/Switch.tsx
    hash: 0988af810a1785ab44c6f8fb49ed47bb7b7efabdefe7e3392699b85b5b82691c
  - path: libs/ui-components/src/tabs/Tabs.tsx
    hash: 64fb20f0af069cd0d21dff3ecba2e95fe4f4c7ff945c2deb50b0889c2e9b932e
  - path: libs/ui-components/src/tag-list/TagList.tsx
    hash: e74d464970e942ff9cef4d5106514551d09613190a7c3062b74fd0b6414b4c36
  - path: libs/ui-components/src/tag/Tag.tsx
    hash: e03c2c98e60af419b5076735dbfbbf06fbaaf42b7248a9b3f882a8c86808a322
  - path: libs/ui-components/src/textarea/TextArea.tsx
    hash: 9a39bcbf33b351ed71e6fcd047c53044d0d416f87fe6a7ad15bf5e4fa961e19c
  - path: libs/ui-components/src/thickness-selector/ThicknessSelector.tsx
    hash: 406e8fb7a00e2544f74ac36dd1fb8c43c15d5bc6fd8391b0705b7c6c16988c11
  - path: libs/ui-components/src/tooltip/Tooltip.tsx
    hash: edeb35f864b6b0e95d87bee9a80e1e2377246b6a588852b15a1d7e2664aa844a
  - path: libs/ui-components/src/transmissions-timeline/TransmissionsTimeline.tsx
    hash: 8d1def15f77ad7d7ff7ee6775286e9aacd9d3b6d832786ae3db0a44b4a5cba75
sources_digest: 36fa0264765f6c075d6bb46e69cf0bbe4ab50ba5fb1384f8a7c533c3a6c2665f
links: []
generator:
  version: 1
covers:
  - symbol: formatSliderNumber
    kind: function
    at: 'libs/ui-components/src/slider/slider.utils.ts:L3-L8'
  - symbol: SliderTrackBackground
    kind: type
    at: 'libs/ui-components/src/slider/slider.utils.ts:L10-L15'
  - symbol: getSliderTrackBackground
    kind: function
    at: 'libs/ui-components/src/slider/slider.utils.ts:L19-L34'
  - symbol: SolarStatusProps
    kind: interface
    at: 'libs/ui-components/src/solar-status/SolarStatus.tsx:L12-L21'
  - symbol: SolarPhase
    kind: interface
    at: 'libs/ui-components/src/solar-status/SolarStatus.tsx:L23-L26'
  - symbol: SolarStatus
    kind: function
    at: 'libs/ui-components/src/solar-status/SolarStatus.tsx:L61-L118'
  - symbol: SpinnerProps
    kind: interface
    at: 'libs/ui-components/src/spinner/Spinner.tsx:L6-L11'
  - symbol: Spinner
    kind: function
    at: 'libs/ui-components/src/spinner/Spinner.tsx:L15-L41'
  - symbol: clampAsidePct
    kind: function
    at: 'libs/ui-components/src/split-view/SplitView.tsx:L18-L18'
  - symbol: SplitViewProps
    kind: interface
    at: 'libs/ui-components/src/split-view/SplitView.tsx:L20-L37'
  - symbol: SplitView
    kind: function
    at: 'libs/ui-components/src/split-view/SplitView.tsx:L39-L183'
  - symbol: SwitchRowProps
    kind: type
    at: 'libs/ui-components/src/switch-row/SwitchRow.tsx:L11-L14'
  - symbol: SwitchRow
    kind: function
    at: 'libs/ui-components/src/switch-row/SwitchRow.tsx:L16-L31'
  - symbol: SwitchEvent
    kind: interface
    at: 'libs/ui-components/src/switch/Switch.tsx:L12-L14'
  - symbol: SwitchSize
    kind: type
    at: 'libs/ui-components/src/switch/Switch.tsx:L16-L16'
  - symbol: SwitchProps
    kind: interface
    at: 'libs/ui-components/src/switch/Switch.tsx:L18-L29'
  - symbol: Switch
    kind: function
    at: 'libs/ui-components/src/switch/Switch.tsx:L31-L76'
  - symbol: onClickCallback
    kind: function
    at: 'libs/ui-components/src/switch/Switch.tsx:L45-L52'
  - symbol: TabsProps
    kind: interface
    at: 'libs/ui-components/src/tabs/Tabs.tsx:L11-L20'
  - symbol: Tabs
    kind: function
    at: 'libs/ui-components/src/tabs/Tabs.tsx:L22-L118'
  - symbol: handleTabClick
    kind: function
    at: 'libs/ui-components/src/tabs/Tabs.tsx:L41-L52'
  - symbol: TagListProps
    kind: interface
    at: 'libs/ui-components/src/tag-list/TagList.tsx:L10-L16'
  - symbol: TagList
    kind: function
    at: 'libs/ui-components/src/tag-list/TagList.tsx:L18-L47'
  - symbol: TagProps
    kind: interface
    at: 'libs/ui-components/src/tag/Tag.tsx:L11-L19'
  - symbol: Tag
    kind: function
    at: 'libs/ui-components/src/tag/Tag.tsx:L21-L53'
  - symbol: TextAreaProps
    kind: type
    at: 'libs/ui-components/src/textarea/TextArea.tsx:L6-L12'
  - symbol: TextArea
    kind: function
    at: 'libs/ui-components/src/textarea/TextArea.tsx:L14-L31'
  - symbol: ThicknessSelectorProps
    kind: interface
    at: 'libs/ui-components/src/thickness-selector/ThicknessSelector.tsx:L8-L11'
  - symbol: ThicknessSelector
    kind: function
    at: 'libs/ui-components/src/thickness-selector/ThicknessSelector.tsx:L13-L31'
  - symbol: TooltipPlacement
    kind: type
    at: 'libs/ui-components/src/tooltip/Tooltip.tsx:L19-L19'
  - symbol: TooltipProps
    kind: type
    at: 'libs/ui-components/src/tooltip/Tooltip.tsx:L21-L26'
  - symbol: TooltipComponent
    kind: function
    at: 'libs/ui-components/src/tooltip/Tooltip.tsx:L31-L97'
  - symbol: Tooltip
    kind: function
    at: 'libs/ui-components/src/tooltip/Tooltip.tsx:L99-L109'
  - symbol: TransmissionsTimelineProps
    kind: type
    at: >-
      libs/ui-components/src/transmissions-timeline/TransmissionsTimeline.tsx:L10-L15
  - symbol: TransmissionsTimeline
    kind: function
    at: >-
      libs/ui-components/src/transmissions-timeline/TransmissionsTimeline.tsx:L17-L73
---

<!-- context:generated:start -->

## Summary

Consistent use of CSS Modules (*.module.css files) across all presentational components for encapsulated styling and className composition. Components import module stylesheets and apply classes conditionally via classnames utility (cx). Design enables zero class-name collisions and type-safe className references, but constrains styling customization to props-based overrides and inline style binding for runtime color/dimension adjustments.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
