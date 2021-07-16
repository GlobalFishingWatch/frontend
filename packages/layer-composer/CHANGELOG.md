# @globalfishingwatch/layer-composer

## 8.10.1

### Patch Changes

- a583eba9: rollback track highlight

## 8.10.0

### Minor Changes

- 58d28355: Handle user context layers with line features

## 8.9.1

### Patch Changes

- 0ea624c9: make cluster interaction unique

## 8.9.0

### Minor Changes

- fdf6b275: support showAuthorizationStatus dataview config in encounter events

## 8.8.1

### Patch Changes

- 1154779b: open attribution link in target blank

## 8.8.0

### Minor Changes

- 12482b76: include encounter vessel in feature properties

## 8.7.0

### Minor Changes

- 7f486176: highlight tile-cluster event

## 8.6.0

### Minor Changes

- 3513a689: support interaction (configured in dataview as presenceDetails) for presence layers

## 8.5.0

### Minor Changes

- ea0e1b8a: fix events generator

## 8.4.0

### Minor Changes

- 060b3854: workaround for duplicated events in generator
- ed8af7ae: workaround for duplicated api events

## 8.3.0

### Minor Changes

- cleanup events generator

## 8.2.1

### Patch Changes

- b268d362: fixed instable delta time

## 8.2.0

### Minor Changes

- 87882042: add sublayerInteractionType

## 8.1.0

### Minor Changes

- fishing events

## 8.0.0

### Patch Changes

- Updated dependencies [undefined]
  - @globalfishingwatch/api-types@4.3.0

## 7.3.0

### Minor Changes

- events with track segments

## 7.2.0

### Minor Changes

- resolve vessel events generator

### Patch Changes

- Updated dependencies [undefined]
  - @globalfishingwatch/api-types@4.2.6
- 05fe3de6: fixed issue with 4w time range + more greedy

## 7.1.3

### Patch Changes

- d14baf30: fix undefined in legend when no bins data

## 7.1.2

### Patch Changes

- ac5fb891: fix undefined in legend when no bins data

## 7.1.1

### Patch Changes

- d5dd9f90: Fishing map/4wings filter precision
- Updated dependencies [d5dd9f90]
  - @globalfishingwatch/fourwings-aggregate@4.0.3

## 7.1.0

### Minor Changes

- 6c1b25bb: include leading point in filterTrackByTimerange

## 7.0.4

### Patch Changes

- daa1de75: satellite basemap attribution

## 7.0.3

### Patch Changes

- 9e507541: compute timeseries once on idle

## 7.0.2

### Patch Changes

- Updated dependencies [b230075f]
  - @globalfishingwatch/fourwings-aggregate@4.0.2

## 7.0.1

### Patch Changes

- Updated dependencies [18fbfda4]
  - @globalfishingwatch/fourwings-aggregate@4.0.1

## 7.0.0

### Minor Changes

- 1a3d0960: Fishing map/presence less than one day

### Patch Changes

- Updated dependencies [1a3d0960]
  - @globalfishingwatch/fourwings-aggregate@4.0.0

## 6.1.4

### Patch Changes

- 7d060771: Fishingmap/last minute improvements
- Updated dependencies [7d060771]
  - @globalfishingwatch/api-types@4.2.4

## 6.1.3

### Patch Changes

- 6b374674: Fishing map/minor fixes

## 6.1.2

### Patch Changes

- d43610ba: Breaks fixes

## 6.1.1

### Patch Changes

- b87943a6: Fishing map/environment fixes

## 6.1.0

### Minor Changes

- 1050379b: legends loading and moved to root metadata

## 6.0.4

### Patch Changes

- abdd6709: Fix default color ramp

## 6.0.3

### Patch Changes

- 67fdfec5: fix color ramps

## 6.0.2

### Patch Changes

- cfae2b4b: fix crash when no sublayers present

## 6.0.1

### Patch Changes

- fix tiles api url

## 6.0.0

### Major Changes

- 5d252a2d: buckets from api and dynamic bivariate

## 5.3.0

### Minor Changes

- 0ec2156f: User tracks

### Patch Changes

- Updated dependencies [0ec2156f]
  - @globalfishingwatch/data-transforms@1.2.0
  - @globalfishingwatch/fourwings-aggregate@3.1.1

## 5.2.5

### Patch Changes

- cd532944: fix colorRampToWhite

## 5.2.4

### Patch Changes

- 0a755cc4: added color scales to white and fixed legend

## 5.2.3

### Patch Changes

- Updated dependencies [undefined]
  - @globalfishingwatch/fourwings-aggregate@3.1.0

## 5.2.2

### Patch Changes

- 8d08df8a: export CONFIG_BY_INTERVAL

## 5.2.1

### Patch Changes

- c0dc95ec: restore uniqueFeatureInteraction with layer id checking

## 5.2.0

### Minor Changes

- bf2d09a1: remove uniqueFeatureInteraction for heatmapAnimated

## 5.1.2

### Patch Changes

- af994916: Sort datasets to improve chance of hitting cache

## 5.1.1

### Patch Changes

- 80907c1f: fixes latest commit

## 5.1.0

### Minor Changes

- 87a54e62: auto detect intervals by dataset configuration

## 5.0.1

### Patch Changes

- bb4978cd: fix blob mode

## 5.0.0

### Major Changes

- 358004cb: Use client-side aggregation with env layers

### Patch Changes

- Updated dependencies [358004cb]
  - @globalfishingwatch/fourwings-aggregate@3.0.0

## 4.19.2

### Patch Changes

- call cluster tiles api with the new "maxClusterZoom" parameter

## 4.19.1

### Patch Changes

- bug fixes

## 4.19.0

### Minor Changes

- f570b76f: support uniqueFeatureInteraction in layer-composer and map interaction hook

## 4.18.1

### Patch Changes

- fix generators type export

## 4.18.0

### Minor Changes

- match latest versions

## 4.17.3

### Patch Changes

- polish tile cluster generator

## 4.17.2

### Patch Changes

- make params optional in tile-cluster

## 4.17.1

### Patch Changes

- tile-cluster fix generatorId and mark interactive

## 4.17.0

### Minor Changes

- ce98aa73: new tile cluster generator

## 4.16.0

### Minor Changes

- [`f7b017f0`](https://github.com/GlobalFishingWatch/frontend/commit/f7b017f0c72bd1f90e6a984ff5c26e524d7d735a) [#360](https://github.com/GlobalFishingWatch/frontend/pull/360) Thanks [@j8seangel](https://github.com/j8seangel)! - set user context layers as interactive

## 4.15.0

### Minor Changes

- expose temporal grid source layer id

## 4.14.5

### Patch Changes

- fix highted areas color

## 4.14.4

### Patch Changes

- fix highlight typo

## 4.14.3

### Patch Changes

- fix feature state context styles

## 4.14.2

### Patch Changes

- highlight style in context areas

## 4.14.1

### Patch Changes

- update bivariate color ramp

## 4.14.0

### Minor Changes

- [`348ce272`](https://github.com/GlobalFishingWatch/frontend/commit/348ce272bd50730db5ad794c80f8b62750a64a90) [#333](https://github.com/GlobalFishingWatch/frontend/pull/333) Thanks [@satellitestudiodesign](https://github.com/satellitestudiodesign)! - store visibleSublayers in heatmap metadata

## 4.13.3

### Patch Changes

- 41e9c20b: Added opacity option to track layer

## 4.13.2

### Patch Changes

- 0180dd0b: not rename generatorId in user-context

## 4.13.1

### Patch Changes

- match latest versions

## 4.13.0

### Minor Changes

- 781fce16: export getTimeSeries from fourwings-aggregate

## 4.12.0

### Minor Changes

- layer composer frameToDate

## 4.11.2

### Patch Changes

- support context layers attribution

## 4.11.1

### Patch Changes

- include generatedAt date.now() value

## 4.11.0

### Minor Changes

- interactive heatmap layer with featureState

## 4.10.4

### Patch Changes

- d160e84a: support different order group for heatmap layers

## 4.10.3

### Patch Changes

- 2d0cdffa: fix typings

## 4.10.2

### Patch Changes

- dont force presence color ramp

## 4.10.1

### Patch Changes

- fix breaks number with optional param

## 4.10.0

### Minor Changes

- change carto layers in layer-composer for cvp

## 4.9.4

### Patch Changes

- fix amathea color ramp steps

## 4.9.3

### Patch Changes

- fix default static heatmap ramp breaks

## 4.9.2

### Patch Changes

- fix heatmap animated click interaction

## 4.9.1

### Patch Changes

- improve highlight styles

## 4.9.0

### Minor Changes

- e37d269: fix heatmap datasets

## 4.8.3

### Patch Changes

- restore layers order

## 4.8.2

### Patch Changes

- move default layer order below basemapFill

## 4.8.1

### Patch Changes

- Fix heatmap rgba color

## 4.8.0

### Minor Changes

- 82f97f5: Update context layers

## 4.7.0

### Minor Changes

- Update context layers dictionary

## 4.6.0

### Minor Changes

- Update context layers dictionary

### Patch Changes

- Updated dependencies [undefined]
  - @globalfishingwatch/data-transforms@1.0.4

## 4.5.0

### Minor Changes

- 2d0a2fa: Contextual layers

## 4.4.1

### Patch Changes

- b70a9c0: Fishingmap/bugfixes

## 4.4.0

### Minor Changes

- c26fb07: Allow sublayer visibility toggle

## 4.3.0

### Minor Changes

- 75cc59c: Fishingmap/legend label

## 4.2.1

### Patch Changes

- afa2d1b: Bivariate legend

## 4.2.0

### Minor Changes

- bc29371: new useTileState hook

## 4.1.1

### Patch Changes

- Fix default 4wings api tiles url

## 4.1.0

### Minor Changes

- Use .env variables for tiles API url

## 4.0.1

### Patch Changes

- fix bivariate ramp color ids

## 4.0.0

### Major Changes

- 6b5fdf8: Temporalgrid performance and bugfixes

## 3.0.0

### Major Changes

- d7bc617: Added extruded mode and merged geomType and combinationMode into mode

## 2.16.0

### Minor Changes

- 5cb8e42: Layer composer heatmap refacto

## 2.15.0

### Minor Changes

- a40d300: Fishing map blob

## 2.14.1

### Patch Changes

- 9b6c010: Fishing map hover

## 2.14.0

### Minor Changes

- 87dfcf5: animated heatmap legend

## 2.13.4

### Patch Changes

- fae4346: Update types

## 2.13.3

### Patch Changes

- Release fishing-map
- Updated dependencies [undefined]
  - @globalfishingwatch/data-transforms@1.0.2

## 2.13.2

### Patch Changes

- 440e403: Fix heatmap transparent outline

## 2.13.1

### Patch Changes

- da23184: Fix heatmap path url

## 2.13.0

### Minor Changes

- 9a356a0: Release fishing-map

## 2.12.0

### Minor Changes

- 08a9236: New basemap

## 2.11.1

### Patch Changes

- 0c2a302: Fix pickValueAt

## 2.11.0

### Minor Changes

- 1774aee: Interaction hooks and user-context ramps

## 2.10.1

### Patch Changes

- fix stats filters

## 2.10.0

### Minor Changes

- e737311: pow scale exponent option to heatmap generator

## 2.9.0

### Minor Changes

- 24344bc: Clean LegendRamp

## 2.8.1

### Patch Changes

- e6f5aa7: Update enpdoints ids

## 2.8.0

### Minor Changes

- a566ff6: Layer component

## 2.7.1

### Patch Changes

- 8912bb0: fix temporal-grid demo

## 2.7.0

### Minor Changes

- ba5064b: fix temporalgrid filters

## 2.6.1

### Patch Changes

- 488b88d: Fix heatmap filters

## 2.6.0

### Minor Changes

- 99e3507: Update workspaces - dataviews - datasets types

## 2.5.0

### Minor Changes

- 152d7ed: y
