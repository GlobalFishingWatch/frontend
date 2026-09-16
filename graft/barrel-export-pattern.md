---
name: Barrel Export Pattern
slug: barrel-export-pattern
type: concept
sources:
  - path: libs/ui-components/src/icon/index.ts
    hash: 9fcb8a738b3275ccca6b004ac59b96e86f4a8311fc48f4f6cca6a670966cfff9
  - path: libs/ui-components/src/index.ts
    hash: 67fe855c8460cfd278ab517dcb932aa33141544027000cf697603f507be40382
  - path: libs/ui-components/src/input-date/index.ts
    hash: 00a95d8b3453c4e5a2e72e204149df99ea991d8d2ff72e9584207a5d14df925e
  - path: libs/ui-components/src/input-text/index.ts
    hash: 779255e7d74491bbb153c527496a036bf90e6abd5dbb9fc39904dd4015ada26f
  - path: libs/ui-components/src/logo/index.ts
    hash: d1eec4466c443c341a4fcb16555b75e8f197c9e0747e4762f3a8bebf59deda6e
  - path: libs/ui-components/src/map-legend/index.ts
    hash: 5856f1741d762b841e9886fcdfcb0100ff5d43d2c2eceb8dcb74073aff89c5ca
  - path: libs/ui-components/src/menu/index.ts
    hash: 693cbe804ad678766b072c8b90f027cc9c5692e098e4e1ab4ebf32a69fd1c9cb
  - path: libs/ui-components/src/miniglobe/index.ts
    hash: ab49b47420e8bb303c8c9485dd23f35817513c01264ee6ec5510e5fe6481e04d
  - path: libs/ui-components/src/modal/index.ts
    hash: df52664337ed21c6be59760b85c4b7ec01c38a22386e1889a8c4e025a7b99050
  - path: libs/ui-components/src/multi-select/index.ts
    hash: de181d766cef1fe539a7bee66ce156a45a6a0442c3df98c078bd1d611f134c20
  - path: libs/ui-components/src/popover/index.ts
    hash: 86ca89e27b3a7888366432c7a6c408b25d04b80b7d2238d514a2ba69b27d36ac
  - path: libs/ui-components/src/progress-bar/index.ts
    hash: 9d57ab18166268540578f7d3dca2821494776196f0ce37d131aab13addaca7fa
  - path: libs/ui-components/src/radio/index.ts
    hash: 5bb9a800249fdfe16c6ccfa0bf9266c498190abd7167dd91648a101e3c7692b7
  - path: libs/ui-components/src/select/index.ts
    hash: 63daeaf2d136579037a8519d28c0261c34b1a89fed75e233e1a851eeae80da79
  - path: libs/ui-components/src/slider-range/index.ts
    hash: 196769f4a886573689b074d6eb2ab397a75083210785f444d5b7187af049a363
  - path: libs/ui-components/src/slider/index.ts
    hash: 0db47e2b2f6b3f78f64da350847f667a698cfe51204ac562be4f28439940ab5a
sources_digest: 12436278db36b0a9b916b5b06ea9b7b3fa4c24fb89fbae12cc3a477c7adc098b
links: []
generator:
  version: 1
covers:
  - symbol: SelectOption
    kind: type
    at: 'libs/ui-components/src/select/index.ts:L7-L14'
  - symbol: SelectOnChange
    kind: type
    at: 'libs/ui-components/src/select/index.ts:L19-L19'
  - symbol: SelectOnRemove
    kind: type
    at: 'libs/ui-components/src/select/index.ts:L23-L23'
---

<!-- context:generated:start -->

## Summary

Ubiquitous organizational pattern throughout the ui-components library where index.ts files re-export named exports from sibling implementation files (e.g., icon/index.ts exports Icon and icon.config from ./Icon, InputText/index.ts exports from ./InputText). This centralizes public API entry points, shields consumers from internal directory structure, and enables refactoring without breaking downstream imports. Applied consistently to nearly all components (Icon, InputText, InputDate, Select, MultiSelect, Slider, Radio, Modal, Popover, Menu, Miniglobe, ProgressBar, MapLegend, Logo) but can reduce tree-shaking efficiency if consumers import broad aggregators.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
