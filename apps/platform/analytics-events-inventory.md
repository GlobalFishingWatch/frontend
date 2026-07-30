# Google Analytics `trackEvent` Inventory

> **platform** (frontend monorepo) — Regenerated: 2026-07-30
>
> Paths are relative to `apps/platform/`. All events go through `trackEvent` from
> [features/app/analytics.hooks.ts](apps/platform/features/app/analytics.hooks.ts) (a typed
> `trackEventBase<TrackCategory>`).

## `TrackCategory` values

`features/app/analytics.hooks.ts:15`

| Enum member | GA value |
| --- | --- |
| `General` | `general` |
| `ActivityData` | `activity_data` |
| `Analysis` | `analysis` |
| `DataDownloads` | `data_downloads` |
| `EnvironmentalData` | `environmental_data` |
| `GlobalReports` | `global_reports` |
| `HelpHints` | `help_hints` |
| `I18n` | `internationalization` |
| `ReferenceLayer` | `reference_layer` |
| `SearchVessel` | `search_vessel` |
| `Timebar` | `timebar` |
| `Tracks` | `tracks` |
| `User` | `user` |
| `VesselGroups` | `vessel_groups` |
| `VesselGroupReport` | `vessel_group_report` |
| `VesselProfile` | `vessel_profile` |
| `WorkspaceManagement` | `workspace_management` |
| `MapInteraction` | `map_interaction` |

---

## Analytics & Page Tracking

- **`features/app/analytics.hooks.ts:58`** — `General`
  - Action: `'general'`
  - `other`: `pagetype` (`locationType`, or `locationType (locationCategory)` for `WORKSPACES_LIST`), `language`, `user_login_state`; when logged in also `user_id`, `organization_type`, `organization_type_hashed`, `country`, `user_cohort`, `user_group`
  - _(`customer_email` / `customer_email_hashed` are commented out)_

---

## User

- **`features/_user/LoginLink.tsx:33`** — `User`
  - Action: `` `Clicked login button${loginSource ? ` from ${loginSource}` : ''}` ``

- **`features/_user/user.hooks.ts:113`** — `User`
  - Action: `'login_success'`
  - Label: `loginSource ?? ''`
  - `other`: `{ user_id }` _(`email` commented out)_

---

## Nav & Sidebar

- **`features/nav/MainNav.tsx:88`** — `General`
  - Action: `` `clicked on ${category}` ``

- **`features/nav/MainNav.tsx:97`** — `SearchVessel`
  - Action: `'Click search icon to open search panel'`

- **`features/_map/sidebar/SidebarHeader.tsx:127`** — `SearchVessel`
  - Action: `'Toggle search type to filter results'`
  - Label: `option.id`

- **`features/_map/sidebar/buttons/ShareWorkspaceButton.tsx:46`** — category varies (`trackEventCategories[location]`: `WorkspaceManagement` for `MAP`/`WORKSPACE`, `Analysis` for `REPORT`/`WORKSPACE_REPORT`, `VesselProfile` for `VESSEL`/`WORKSPACE_VESSEL`)
  - Action: `` `Click share ${trackEventActions[location]}'}` `` — one of `Click share workspace'}` / `Click share report'}`
  - ⚠️ Stray `'}` in the template literal leaks into the GA action string. Bug, not intentional.

- **`features/_map/sidebar/buttons/NavigationHistoryButton.tsx:64`** — `VesselProfile`
  - Action (dynamic, first match wins; event skipped when none): `close_vessel_panel`, `close_report_panel`, `close_vessel_group_report_panel`, `close_workspace`

---

## Workspace Management

- **`features/_map/workspaces-list/WorkspaceWizard.tsx:96`** — `WorkspaceManagement`
  - Action: `'Uses marine manager workspace wizard'`
  - Label: `getEventLabel([inputSearch, selectedItem?.properties?.name || ''])`

- **`features/_map/workspaces-list/WorkspacesList.tsx:41`** — `GlobalReports`
  - Action: `` `Clicked highlighted ${workspace.reportCategory} workspace` ``
  - Label: `workspace.name`

- **`features/_map/workspace/save/WorkspaceCreateModal.tsx:203`** — `WorkspaceManagement`
  - Action: `'Save current workspace'`
  - Label: `workspaceUpdated?.name ?? 'Unknown'`

- **`features/_map/workspace/save/WorkspaceEdit.tsx:109`** — `WorkspaceManagement`
  - Action: `'Edit current workspace'`
  - Label: `dispatchedAction.payload?.name ?? 'Unknown'`

---

## Downloads

- **`features/_map/download/DownloadTrackModal.tsx:74`** — `DataDownloads`
  - Action: `'Track download'`
  - Label: `downloadTrackName`

- **`features/_map/download/DownloadActivityGridded.tsx:165`** — `DataDownloads`
  - Action: `'Download GeoTIFF file'`
  - Label: `JSON.stringify({ regionName, downloadType: 'gridded activity', groupBy, temporalResolution, spatialResolution, sourceNames })`

- **`features/_map/download/DownloadActivityGridded.tsx:180`** — `DataDownloads`
  - Action: `` `Download ${format} file` ``
  - Label: `JSON.stringify({ regionName, downloadType: 'gridded activity', spatialResolution, groupBy, temporalResolution, sourceNames })`

- **`features/_map/download/DownloadActivityGridded.tsx:213`** — `DataDownloads`
  - Action: `'Activity download'`
  - Label: `getEventLabel([downloadParams.areaName, ...downloadDataviews.map(...)])`

- **`features/_map/download/DownloadActivityEnvironment.tsx:142`** — `DataDownloads`
  - Action: `'Download GeoTIFF file'`
  - Label: `JSON.stringify({ regionName, downloadType: 'environment', spatialResolution, temporalResolution, sourceNames })`

- **`features/_map/download/DownloadActivityEnvironment.tsx:156`** — `DataDownloads`
  - Action: `` `Download ${format} file` ``
  - Label: `JSON.stringify({ regionName, downloadType: 'environment', spatialResolution, temporalResolution, sourceNames })`

- **`features/_map/download/DownloadActivityEnvironment.tsx:187`** — `DataDownloads`
  - Action: `'Activity download'`
  - Label: `getEventLabel([downloadParams.areaName, ...downloadDataviews.map(...)])`

- **`features/_map/download/DownloadActivityByVessel.tsx:123`** — `DataDownloads`
  - Action: `` `Download ${format.toUpperCase()} file` ``
  - Label: `JSON.stringify({ regionName, downloadType: 'active vessels', temporalResolution, groupBy, sourceNames })`

- **`features/_map/download/DownloadActivityByVessel.tsx:154`** — `DataDownloads`
  - Action: `'Activity download'`
  - Label: `getEventLabel([downloadAreaName || EMPTY_FIELD_PLACEHOLDER, ...downloadDataviews.map(...)])`

---

## Datasets & Reference Layers

- **`features/_map/datasets/datasets.hook.ts:228`** — `ReferenceLayer`
  - Action: `'Start uploading user dataset'`

- **`features/_map/datasets/upload/NewDataset.tsx:137`** — `User`
  - Action: `` `Confirm ${datasetMetadata.configuration?.frontend?.geometryType} upload` ``
  - Label: `datasetMetadata?.name`

- **`features/_map/layer-library/LayerLibraryUserPanel.tsx:98`** — `ReferenceLayer`
  - Action: `'Draw a custom reference layer - Start'`

- **`features/_map/layer-library/LayerLibraryItem.tsx:96`** — `EnvironmentalData`
  - Action: `` `add ${category} layer to workspace` ``
  - Label: ``getEventLabel([`layer_id: ${id}`])``

- **`features/_map/map/overlays/draw/DrawDialog.tsx:118`** — `ReferenceLayer`
  - Action: `'Draw a custom reference layer - Click dismiss'`

- **`features/_map/map/overlays/draw/DrawDialog.tsx:166`** — `ReferenceLayer`
  - Action: `'Draw a custom reference layer - Click save'`

- **`features/_map/map/overlays/draw/DrawDialog.tsx:177`** — `ReferenceLayer`
  - Action: `'Draw a custom reference layer - Click + icon'`

---

## Workspace Sections (Layer Toggling)

- **`features/_map/workspace/vessel-groups/VesselGroupsSection.tsx:48`** — `VesselGroups`
  - Action: `'Click to add vessel group to workspace'`

- **`features/_map/workspace/vessel-groups/VesselGroupsSection.tsx:55`** — `ReferenceLayer`
  - Action: `'Open panel to add a reference layer'`
  - Value: `userDatasets.length`

- **`features/_map/workspace/user/UserSection/UserSection.tsx:79`** — `ReferenceLayer`
  - Action: `'Draw a custom reference layer - Start'`

- **`features/_map/workspace/user/UserSection/UserSection.tsx:90`** — `ReferenceLayer`
  - Action: `'Open panel to upload new reference layer'`
  - Value: `userDatasets.length`

- **`features/_map/workspace/user/UserSection/UserSection.tsx:99`** — `ReferenceLayer`
  - Action: `'Open panel to add a reference layer'`
  - Value: `userDatasets.length`

- **`features/_map/workspace/user/UserSection/UserSection.tsx:115`** — `ReferenceLayer`
  - Action: `'Toggle reference layer'`
  - Label: `getEventLabel([action, layerTitle])`

- **`features/_map/workspace/context-areas/ContextAreaSection.tsx:39`** — `ReferenceLayer`
  - Action: `'Open panel to add a reference layer'`
  - Value: `userDatasets.length`

- **`features/_map/workspace/context-areas/ContextAreaSection.tsx:55`** — `ReferenceLayer`
  - Action: `'Toggle reference layer'`
  - Label: `getEventLabel([action, layerTitle])`

- **`features/_map/workspace/events/EventsSection.tsx:41`** — `ActivityData`
  - Action: `` `Toggle ${dataview.category} layer` ``
  - Label: `getEventLabel([action, dataview.id])`

- **`features/_map/workspace/detections/DetectionsSection.tsx:72`** — `ActivityData`
  - Action: `'Click on bivariate option'`
  - Label: `getEventLabel(['combine', dataview1.name ?? dataview1.id, getActivitySources(dataview1), ...getActivityFilters(dataview1.config?.filters), dataview2.name ?? dataview2.id, getActivitySources(dataview2), ...getActivityFilters(dataview2.config?.filters)])`

- **`features/_map/workspace/detections/DetectionsSection.tsx:93`** — `ActivityData`
  - Action: `` `Toggle ${dataview.category} layer` ``
  - Label: `getEventLabel([action, getActivitySources(dataview), ...getActivityFilters(dataview.config?.filters)])`

- **`features/_map/workspace/activity/ActivitySection.tsx:80`** — `ActivityData`
  - Action: `'Click on bivariate option'`
  - Label: `getEventLabel(['combine', dataview1.name ?? dataview1.id, getActivitySources(dataview1), ...getActivityFilters(dataview1.config?.filters), dataview2.name ?? dataview2.id, getActivitySources(dataview2), ...getActivityFilters(dataview2.config?.filters)])`

- **`features/_map/workspace/activity/ActivitySection.tsx:101`** — `ActivityData`
  - Action: `` `Toggle ${dataview.category} layer` ``
  - Label: `getEventLabel([action, getActivitySources(dataview), ...getActivityFilters(dataview.config?.filters)])`

- **`features/_map/workspace/activity/ActivityLayerPanel.tsx:117`** — `ActivityData`
  - Action: `'Click on bivariate option'`
  - Label: `getEventLabel(['split', dataview.name ?? dataview.id ?? bivariateDataviews[0], getActivitySources(dataview), ...getActivityFilters(dataview.config?.filters), bivariateDataviews[1]])`

- **`features/_map/workspace/vessels/VesselInfoCorrection.tsx:23`** — `VesselProfile`
  - Action: `'click vessel correction modal'`

- **`features/_map/workspace/vessels/VesselsSection.tsx:123`** — `VesselGroups`
  - Action: `'add_to_vessel_group_from_workspace'`
  - Label: `` `${vesselGroupId}` ``

- **`features/_map/workspace/vessels/VesselsSection.tsx:154`** — `SearchVessel`
  - Action: `'Click search icon to open search panel'`

### Layer filters

All three share Action `` `Click on ${filterKey} filter` `` under `ActivityData`.

- **`features/_map/workspace/shared/LayerFilters.utils.ts:17`** — `trackEventCb(filterKey, label)`, a 200 ms-debounced helper. Called from
  [LayerFilters.tsx](apps/platform/features/_map/workspace/shared/LayerFilters.tsx) and
  [LayerFiltersGap.tsx:51](apps/platform/features/_map/workspace/shared/LayerFiltersGap.tsx#L51)
  (gap filter builds its label from `getActivitySources` + `getActivityFilters({ gapSegmentThreshold })`).
  - Label: caller-supplied

- **`features/_map/workspace/shared/LayerFilters.hooks.ts:306`**
  - Label: `getEventLabel(['deselect', getActivitySources(dataview), ...getActivityFilters({ [filterKey]: filterValue ?? [] })])`

- **`features/_map/workspace/shared/LayerFilters.hooks.ts:328`**
  - Label: `getEventLabel(['clear', getActivitySources(dataview)])`

---

## Environmental

- **`features/_map/workspace/environmental/EnvironmentalSection.tsx:59`** — `EnvironmentalData`
  - Action: `'Open panel to add a environmental dataset'`
  - Value: `userDatasets.length`

- **`features/_map/workspace/environmental/EnvironmentalSection.tsx:73`** — `EnvironmentalData`
  - Action: `'Toggle environmental layer'`
  - Label: `getEventLabel([action, layerTitle])`

- **`features/_map/workspace/environmental/HistogramRangeFilter.tsx:52`** — `EnvironmentalData`
  - Action: `'Filter environmental layer'`
  - Label: `getEventLabel([dataview.name, ...rangeSelected.map((r) => r.toString())])`

---

## Vessel Profile

- **`features/_vessels/vessel/Vessel.tsx:192`** — `VesselProfile`
  - Action: `` `click_${tab.id}_tab` ``

- **`features/_vessels/vessel/VesselHeader.tsx:71`** — `VesselProfile`
  - Action: `'click_vessel_header_actions'`

- **`features/_vessels/vessel/VesselHeader.tsx:79`** — `VesselGroups`
  - Action: `'add_to_vessel_group_from_vessel_profile'`
  - Label: `` `${vesselGroupId}` ``
  - Value: `` `number of vessel identities in group: ${vesselsCount}` ``

- **`features/_vessels/vessel/VesselLink.tsx:107`** — `SearchVessel`
  - Action: `'vessel profile link click'`
  - Label: `` `vesselId: ${vesselId} | datasetId: ${datasetId} | source: ${identity?.sourceCode?.join(', ')}` ``

- **`features/_vessels/vessel/vessel-pin.hooks.ts:201`** — `Tracks`
  - Action: `'Click in vessel from grid cell panel'`
  - Label: `getEventLabel([infoDataset?.id || '', getVesselId(vesselWithIdentity)])`

- **`features/_vessels/vessel/identity/VesselIdentity.tsx:21`** — `VesselProfile`
  - Action: `'click_vessel_source_tab'`
  - Label: `tab.id`

- **`features/_vessels/vessel/identity/VesselIdentitySelector.tsx:51`** — `VesselProfile`
  - Action: `` `change_timeperiod_${identitySource}_tab` ``
  - Label: `` `${identityIndex + 1} | ${start} - ${end}` ``

- **`features/_vessels/vessel/identity/tabs/IdentityTabWrapper.tsx:104`** — `VesselProfile`
  - Action: `'vessel_identity_download'`
  - Label: `identitySource`

- **`features/_vessels/vessel/identity/VesselExternalToolLinks.tsx`** — `VesselProfile`, one per outbound link
  - `:29` Action: `'click_marine_traffic_link'`
  - `:43` Action: `'click_skylight_link'`
  - `:54` Action: `'click_triton_link'`
  - `:64` Action: `'click_cravt_link'`

- **`features/_vessels/vessel/vesselCorrection/VesselCorrectionModal.tsx:117`** — `VesselProfile`
  - Action: `'send_vessel_info_correction'`

- **`features/_vessels/vessel/related-vessels/RelatedVessels.tsx:43`** — `VesselProfile`
  - Action: `` `click_${option.id}_related_vessels_tab` ``

- **`features/_vessels/vessel/areas/VesselAreas.tsx:162`** — `VesselProfile`
  - Action: `` `click_${option.id}_areas_tab` ``

- **`features/_vessels/vessel/activity/VesselActivity.tsx:36`** — `VesselProfile`
  - Action: `` `click_activity_by_${option.id}_summary_tab` ``

- **`features/_vessels/vessel/activity/VesselActivityDownload.tsx:43`** — `VesselProfile`
  - Action: `'vessel_events_download'`
  - Label: `` `${vesselSection}_tab` ``

- **`features/_vessels/vessel/activity/activity-by-type/ActivityByType.tsx:68`** — `VesselProfile`
  - Action: `'View list of events by activity type'`
  - Label: `JSON.stringify({ type })`

---

## Vessel Groups

- **`features/_user/vessel-groups/VesselGroupModal.tsx:231`** — `VesselGroups`
  - Action: `` `match vessels from ${ids ? 'IDs' : csvData && 'CSV'} to create a vessel group` ``
  - Label: ``getEventLabel([transmissionDateFrom && `active after: ${transmissionDateFrom}`, transmissionDateTo && `active before: ${transmissionDateTo}`, datasets && `datasets: ${datasets.join(', ')}`, searchIdField && `id field: ${searchIdField}`])``

- **`features/_user/vessel-groups/VesselGroupModal.tsx:430`** — `VesselGroups`
  - Action: `` `${editingVesselGroupId ? 'Edit' : 'Create new'} vessel group` ``
  - Label: ``getEventLabel([`vessel_id: ${vesselGroupId}`, calculateVMSVesselsPercentage(vesselGroupVessels)])``
  - Value: `` `number of vessels: ${vessels.length}` ``

- **`features/_user/vessel-groups/VesselGroupModalSearch.tsx:169`** — `HelpHints`
  - Action: `'click see csv format link in vessel group modal'`

---

## Search

- **`features/_vessels/search/search.hook.ts:166`** — `SearchVessel`
  - Action: `searchType === 'basic' ? 'Search specific vessel' : 'add_filters_and_hit_search_in_advanced_search'`
  - Label: `query`
  - Value: `total`

- **`features/_vessels/search/search.hook.ts:251`** — `SearchVessel`
  - Action: `'Add filters to refine Advanced Search'`
  - Label: `` `name: ${debouncedQuery} | MMSI: ${searchFilters.ssvid} | IMO: ${searchFilters.imo} | Call Sign: ${searchFilters.callsign} | Owner: ${searchFilters.owner} | Info source: ${searchFilters.infoSource} | Sources: ${searchFilters.sources} | Flag: ${searchFilters.flag} | Active After: ${searchFilters.transmissionDateFrom} | Active Before: ${searchFilters.transmissionDateTo}` ``

- **`features/_vessels/search/SearchActions.tsx:72`** — `SearchVessel`
  - Action: `'Click view on map'`
  - Label: `` `${activeSearchOption} search` ``

- **`features/_vessels/search/SearchActions.tsx:100`** — `VesselGroups`
  - Action: `vesselGroupId === NEW_VESSEL_GROUP_ID ? 'create_new_vessel_group_from_search' : 'add_vessels_to_vessel_group_from_search'`
  - Label: `` `${activeSearchOption} search` ``
  - Value: `` `number of vessel added to group: ${vesselsSelected.length}` ``

- **`features/_vessels/search/SearchDownload.tsx:41`** — `DataDownloads`
  - Action: `'Download CSV list of vessels from advanced search'`
  - Label: `JSON.stringify(vesselsParsed.map({ name, mmsi, imo, callsign, owner, flag, 'vessel type', 'gear type', transmissions, activeAfter, activeBefore, sources }))`

---

## Map Popups

- **`features/_map/map/popups/categories/VesselsTable.tsx:74`** — `MapInteraction`
  - Action: `` `Clicked see vessel from ${feature?.category}` ``
  - Label: ``getEventLabel([`source: ${source}`])``

- **`features/_map/map/popups/categories/VesselsTable.tsx:192`** — `MapInteraction`
  - Action: `'click_skylight_search_from_popup'`

- **`features/_map/map/popups/categories/VesselsTable.tsx:206`** — `MapInteraction`
  - Action: `'click_skylight_link_from_popup'`

- **`features/_map/map/popups/categories/ContextLayers.tsx:32`** — `DataDownloads`
  - Action: `'Click on polygon, click on download icon'`

- **`features/_map/map/popups/categories/ContextLayers.hooks.ts:69`** — `Analysis`
  - Action: `'Open report'`
  - Label: `getEventLabel([value?.toString(), layerSources ? 'active layer sources: ' + layerSources : ''])`

- **`features/_map/map/popups/categories/EventsPortVisitTooltipRow.tsx:46`** — `GlobalReports`
  - Action: `'Clicked see port report'`
  - Label: ``getEventLabel([` dataset: ${port?.datasetId} `, ` port_id: ${port?.id} `].filter(Boolean))``

- **`features/_map/map/popups/categories/EventsGapTooltipRow.tsx:56`** — `VesselProfile`
  - Action: `'Clicked see gap event'`
  - Label: ``getEventLabel([` dataset_name: ${dataset.name} `, ` source: ${dataset.source} `, dataset.id].filter(Boolean))``

- **`features/_map/map/popups/categories/EventsEncounterTooltipRow.tsx:64`** — `GlobalReports`
  - Action: `'Clicked see encounter event'`
  - Label: ``getEventLabel([` dataset_name: ${dataset.name} `, ` source: ${dataset.source} `, dataset.id].filter(Boolean))``

- **`features/_map/map/popups/categories/EventsClusterRow.tsx:48`** — `VesselProfile`
  - Action: `'Clicked see loitering event'`
  - Label: ``getEventLabel([` dataset_name: ${dataset.name} `, ` source: ${dataset.source} `, dataset.id].filter(Boolean))``

- **`features/_map/map/map-interactions.hooks.ts:279`** — fires one event per clicked feature, built by `getAnalyticsEvent(feature)` in [features/_map/map/map-interaction.utils.ts:29](apps/platform/features/_map/map/map-interaction.utils.ts#L29). Note `category`/`action` are inverted relative to every other call site:
  - Action: `'map_interaction'` _(the constant `TrackCategory.MapInteraction`)_
  - Category: `` `Map click on ${feature.category}` `` _(e.g. `Map click on activity`, `vessels`, `events`, `context`, `user`, `workspaces`, `detections`)_
  - Label _(varies by `feature.category`)_:
    - **Activity / Detections** (positions mode): `` `visualization_mode: positions | vessel_name: ${feature.title} | vessel_id: ${feature.properties.id}` ``
    - **Activity / Detections** (other modes): `` `visualization_mode: ${feature.visualizationMode} | time_interval: ${feature.interval}` ``
    - **Vessels**: `` `event_type: ${feature.type} | vessel_id: ${feature.vesselId}` ``
    - **Events**: `` `event_type: ${feature.eventType} | datasetId : ${feature.datasetId}` ``
    - **Context / User**: `` `${getContextValue(feature)}` ``
    - **Workspaces**: `` `${feature.properties.category} | ${feature.properties.label}` ``
    - anything else: `''`

---

## Timebar

All `Timebar`.

- **`features/_map/timebar/Timebar.tsx:209`**
  - Action: `` `Click on ${isPlaying ? 'Play' : 'Pause'}` ``
  - Label: `getEventLabel([start ?? '', end ?? ''])`

- **`features/_map/timebar/timebar-interactions.hooks.ts:40`**
  - Action: `'Bookmark timerange'`
  - Label: `'removed'`

- **`features/_map/timebar/timebar-interactions.hooks.ts:48`**
  - Action: `'Bookmark timerange'`
  - Label: `getEventLabel([start, end])`

- **`features/_map/timebar/timebar-interactions.hooks.ts:71`**
  - Action: `GA_ACTIONS[e.source]` (`:24`), one of: `Configure timerange using calendar option`, `Zoom In timerange`, `Zoom Out timerange`, `Use hour preset`, `Use day preset`, `Use month preset`, `Use year preset`, `Move timebar slider`, `Select bookmark period`
  - Label: `getEventLabel([e.start, e.end])`

- **`features/_map/timebar/TimebarSettings.tsx:93`**
  - Action: `'Open timebar settings'`
  - Label: ``getEventLabel([`visualization: ${timebarVisualisation}`])``

- **`features/_map/timebar/TimebarSettings.tsx:106`**
  - Action: `'select_timebar_settings'` · Label: `` `${section}` ``

- **`features/_map/timebar/TimebarSettings.tsx:116`**
  - Action: `'select_timebar_settings'` · Label: `` `${TimebarVisualisations.Environment} - ${environmentalDataviewId}` ``

- **`features/_map/timebar/TimebarSettings.tsx:125`**
  - Action: `'select_timebar_settings'` · Label: `` `${TimebarVisualisations.Points} - ${userPointsDataviewId}` ``

- **`features/_map/timebar/TimebarSettings.tsx:135`**
  - Action: `'select_timebar_settings'` · Label: `` `${TimebarVisualisations.VesselGroup} - ${vesselGroupDataviewId}` ``

- **`features/_map/timebar/TimebarSettings.tsx:144`**
  - Action: `'select_timebar_settings'` · Label: `` `${TimebarVisualisations.Vessel} - ${TimebarGraphs.None}` ``

- **`features/_map/timebar/TimebarSettings.tsx:154`**
  - Action: `'select_timebar_settings'` · Label: `` `${TimebarVisualisations.Vessel} - ${timebarGraph}` ``

---

## Reports — Activity

All `Analysis`.

- **`features/_reports/tabs/activity/ReportActivity.tsx:304`**
  - Action: `'Click on see vessels button in report activity'`

- **`features/_reports/tabs/activity/ReportActivitySubsectionSelector.tsx:106`**
  - Action: `` `activity_tab_toggle_${option.id}` ``

- **`features/_reports/tabs/activity/ReportActivityGraphSelector.tsx:107`**
  - Action: `` `Click on ${option.id} activity graph` ``

- **`features/_reports/tabs/activity/ReportActivityPeriodComparison.tsx:39`**
  - Action: `"Select comparison date in 'period comparison'"`
  - Label: `JSON.stringify({ date, regionName, sourceNames })`

- **`features/_reports/tabs/activity/ReportActivityPeriodComparison.tsx:54`**
  - Action: `"Select baseline date in 'period comparison'"`
  - Label: `JSON.stringify({ date, regionName, sourceNames })`

- **`features/_reports/tabs/activity/ReportActivityPeriodComparison.tsx:69`**
  - Action: `"Select duration in 'period comparison'"`
  - Label: `JSON.stringify({ duration, regionName, sourceNames })`

- **`features/_reports/tabs/activity/ReportActivityPeriodComparison.tsx:84`**
  - Action: `"Select duration in 'period comparison'"`
  - Label: `JSON.stringify({ duration, regionName, sourceNames })`

- **`features/_reports/tabs/activity/ReportActivityBeforeAfter.tsx:37`**
  - Action: `"Select date in 'before/after'"`
  - Label: `JSON.stringify({ date, regionName, sourceNames })`

- **`features/_reports/tabs/activity/ReportActivityBeforeAfter.tsx:52`**
  - Action: `"Select duration in 'before/after'"`
  - Label: `JSON.stringify({ duration, durationAmount, durationType, regionName, sourceNames })`

- **`features/_reports/tabs/activity/ReportActivityBeforeAfter.tsx:69`**
  - Action: `"Select duration in 'before/after'"`
  - Label: `JSON.stringify({ duration, durationAmount, durationType, regionName, sourceNames })`

- **`features/_reports/tabs/activity/download/ReportDownload.tsx:23`**
  - Action: `'Download report'`
  - Label: `areaId?.toString()`

---

## Reports — Events

- **`features/_reports/tabs/events/EventsReportGraphSelector.tsx:75`** — `Analysis`
  - Action: `` `Click on ${option.id} activity graph` ``

- **`features/_reports/tabs/events/EventsReportSubsectionSelector.tsx:74`** — `VesselGroupReport`
  - Action: `` `vessel_group_profile_events_tab_${option.id}_graph` ``

- **`features/_reports/tabs/events/EventsReport.tsx:188`** — `Analysis`
  - Action: `'Click on see vessels button in events activity'`

- **`features/_reports/tabs/events/EventsReportDownload.tsx:42`** — `Analysis`
  - Action: `'events_report_download'`
  - Label: `` `${reportEventsSubCategory}_tab` ``

- **`features/_reports/tabs/events/EventReportPorts.tsx:67`** — `GlobalReports`
  - Action: `'Clicked see ports after events'`

---

## Reports — Environment

Both `Analysis`.

- **`features/_reports/tabs/environment/ReportEnvironmentGraphSelector.tsx:61`**
  - Action: `` `Click on ${option.id} environmental graph` ``

- **`features/_reports/tabs/environment/ReportEnvironment.tsx:55`**
  - Action: `'Open panel to add a report layer'`

---

## Reports — Vessels (Shared)

- **`features/_reports/shared/vessels/ReportVesselsTable.tsx:71`** — `GlobalReports`
  - Action: `'redirect to vessel profile'`
  - Label: `shipName`

- **`features/_reports/shared/vessels/ReportVesselsTable.tsx:93`** — `VesselGroupReport`
  - Action: `'vessel_report_pin_vessel'`
  - Label: `vesselId`

- **`features/_reports/shared/vessels/ReportVesselsTableFooter.tsx:109`** — `VesselGroupReport`
  - Action: `'vessel_report_download_csv'`
  - Label: ``getEventLabel([`Groupd id: ${vesselGroup?.id}`, `start date: ${start}`, `end date: ${end}`])`` _(typo `Groupd` is in the source)_
  - Value: `` `number of vessels identities: ${vessels.length}` ``

- **`features/_reports/shared/vessels/ReportVesselsTableFooter.tsx:133`** — `Analysis`
  - Action: `'Click on show more vessels'`

- **`features/_reports/shared/vessels/ReportVesselsTableFooter.tsx:143`** — `Analysis`
  - Action: `'Click on show less vessels'`

- **`features/_reports/shared/vessels/ReportVesselsTableFooter.tsx:151`** — `VesselGroups`
  - Action: `'add_to_vessel_group'`
  - Label: `'report'`

- **`features/_reports/shared/vessels/ReportVesselsGraphSelector.tsx:106`** — `Analysis`
  - Action: `` `vessel_report_group_by_${option.id}` ``

- **`features/_reports/shared/vessels/ReportVesselsFilter.tsx:49`** — `Analysis`
  - Action: `` `Type search into vessel list from ${locationType}` ``
  - Label: `debouncedQuery`

- **`features/_reports/shared/summary/ReportSummary.tsx:46`** — `Analysis`
  - Action: `'Open panel to add a report layer'`

- **`features/_reports/shared/new-report-modal/NewAreaReportModal.tsx:86`** — `WorkspaceManagement`
  - Action: `'Edit current report'`
  - Label: `dispatchedAction.payload?.name ?? 'Unknown'`

- **`features/_reports/shared/new-report-modal/NewAreaReportModal.tsx:122`** — `Analysis`
  - Action: `'Save current report'`
  - Label: `name || 'Unknown'`

- **`features/_reports/shared/area-search/AreaReportSearch.tsx:162`** — `Analysis`
  - Action: `'Search for an area in report'`
  - Label: `getEventLabel([inputValue, selectedItem?.properties?.name || ''])`

---

## Reports — Area

All `Analysis`.

- **`features/_reports/report-area/AreaReport.tsx:171`**
  - Action: `` `Click on ${option.id} report` ``

- **`features/_reports/report-area/title/ReportTitle.tsx:124`**
  - Action: `'Click print/save as pdf'`

- **`features/_reports/report-area/title/ReportTitle.tsx:163`**
  - Action: `'Confirm area buffer'`
  - Label: `` `${previewBuffer.value} ${previewBuffer.unit} ${previewBuffer.operation}` ``

---

## Reports — Vessel Group

- **`features/_reports/report-vessel-group/VesselGroupReportLink.tsx:24`** — `Analysis`
  - Action: `'access_vessel_group_profile'`
  - `other`: `{ vesselGroupId }`

- **`features/_reports/report-vessel-group/VesselGroupReport.tsx:124`** — `VesselGroupReport`
  - Action: `` `access_vessel_group_${tab.id}_tab` ``
  - Label: `getEventLabel([vesselGroup?.id, timeRange?.start || '', timeRange?.end || ''])`
  - Value: `` `number of vessels: ${vesselGroup?.vessels?.length}` ``

---

## Reports — VGR Insights

All `VesselGroupReport`.

- **`.../VGRInsightMOU.tsx:48`** — Action: `'vessel_group_profile_insights_mou_go_to_vessel'` · Label: `vesselId`
- **`.../VGRInsightMOU.tsx:120`** — Action: `'vessel_group_profile_insights_tab_expand_insights'` · Label: `` `${country} ${list} expanded` ``
- **`.../VGRInsightIUU.tsx:39`** — Action: `'vessel_group_profile_insights_tab_expand_insights'` · Label: `'IUU expanded'`
- **`.../VGRInsightGaps.tsx:46`** — Action: `'vessel_group_profile_insights_tab_expand_insights'` · Label: `'gaps expanded'`
- **`.../VGRInsightGaps.tsx:55`** — Action: `'vessel_group_profile_insights_gaps_go_to_vessel'` · Label: `vesselId`
- **`.../VGRInsightFlagChange.tsx:46`** — Action: `'vessel_group_profile_insights_tab_expand_insights'` · Label: `'flag changes expanded'`
- **`.../VGRInsightFlagChange.tsx:55`** — Action: `'vessel_group_profile_insights_flag_changes_go_to_vessel'` · Label: `vesselId`
- **`.../VGRInsightFishing.tsx:61`** — Action: `'vessel_group_profile_insights_tab_expand_insights'` · Label: `'fishing in no-take MPAs expanded'`
- **`.../VGRInsightFishing.tsx:77`** — Action: `'vessel_group_profile_insights_tab_expand_insights'` · Label: `'fishing Regional Fisheries Bodies (RFMOs) expanded'`
- **`.../VGRInsightFishing.tsx:86`** — Action: `'vessel_group_profile_insights_fishing_go_to_vessel'` · Label: `vesselId`
- **`.../VGRInsightLongline.tsx:72`** — Action: `'vessel_group_profile_insights_tab_expand_insights'` · Label: `'longline sets expanded'` **(new)**
- **`.../VGRInsightLongline.tsx:81`** — Action: `'vessel_group_profile_insights_longline_go_to_vessel'` · Label: `vesselId` **(new)**

_All under `features/_reports/tabs/vessel-group-insights/`._

---

## CMS

- **`features/cms/data-terminology/DataTerminology.tsx:40`** — `HelpHints`
  - Action: `` `open_data_terminology_${terminologyKey}` ``
  - Label: `terminologyKey`

---

## i18n

- **`features/i18n/LanguageToggle.tsx:68`** — `I18n`
  - Action: `'Change language'`
  - Label: `lang`

---

## Help & Hints

All `HelpHints`.

- **`features/help/UserGuideLink.tsx:31`**
  - Action: `'redirect to user guide to specific section'`
  - Label: `` `${i18n.language} - ${section}` ``

- **`features/hints/HelpHub.tsx:33`**
  - Action: `"restore help hints after they've been dismissed"`
  - Label: `` `percentage of hints seen: ${percentageOfHintsSeen.toString()}%` ``

- **`features/hints/HelpHub.tsx:52`**
  - Action: `` `redirect to ${destination}` ``
  - Label: `i18n.language`

- **`features/hints/HelpHub.tsx:98`**
  - Action: `'Open user guide modal'` **(new)**

- **`features/hints/Hint.tsx:36`**
  - Action: `'Dismiss one specific help hint'` · Label: `id`

- **`features/hints/Hint.tsx:48`**
  - Action: `'Dismiss all help hints before viewing all'` · Label: `id`

- **`features/hints/Hint.tsx:57`**
  - Action: `'Click on a help hint to view supporting information'` · Label: `id`

- **`features/hints/Hint.tsx:65`**
  - Action: `'clicked on help hint popup'` · Label: `id`

---

## Changes since the 2026-05-13 inventory

### Files moved (feature-folder restructure)

| Old | New |
| --- | --- |
| `user/user.slice.ts` | `features/_user/user.hooks.ts` |
| `sidebar/CategoryTabs.tsx` | `features/nav/MainNav.tsx` |
| `sidebar/*` | `features/_map/sidebar/*` |
| `workspaces-list/*`, `workspace/*`, `download/*`, `datasets/*`, `layer-library/*`, `timebar/*` | under `features/_map/` |
| `vessel/*`, `search/*` | under `features/_vessels/` |
| `vessel-groups/*` | `features/_user/vessel-groups/` |
| `vessel/identity/DataTerminology.tsx` | `features/cms/data-terminology/DataTerminology.tsx` |
| `vessel/identity/VesselIdentity.tsx` (links + download) | `identity/VesselExternalToolLinks.tsx`, `identity/tabs/IdentityTabWrapper.tsx` |
| `vessel/VesselPin.tsx` | `features/_vessels/vessel/vessel-pin.hooks.ts` |
| `help/HelpHub.tsx`, `help/Hint.tsx` | `features/hints/` |
| `workspace/shared/LayerFilters.tsx` (2 of 3 events) | `LayerFilters.hooks.ts` + `LayerFilters.utils.ts` |
| `timebar/Timebar.tsx` (bookmark + range change) | `features/_map/timebar/timebar-interactions.hooks.ts` |

### Events added

- `Clicked login button[ from <source>]` (`User`) — `features/_user/LoginLink.tsx`
- `Open user guide modal` (`HelpHints`) — `features/hints/HelpHub.tsx:98`
- `vessel_group_profile_insights_tab_expand_insights` / `..._longline_go_to_vessel` — `VGRInsightLongline.tsx`

### Events removed

- `clicked on info popup` — `workspace/shared/InfoModal.tsx` deleted
- `open_vessel_info_${vesselSection}_tab` — replaced by `open_data_terminology_${terminologyKey}`
- `update_time_range_from_vessel_group_report` — commented out at `VesselGroupReport.tsx:106`
- `print_vessel_group_profile` — commented out at `VesselGroupReportTitle.tsx:69`

### Events changed

- `login` → `login_success`, now with `label: loginSource` (`features/_user/user.hooks.ts:113`)
- `access_vessel_group_${tab.id}_tab` gained `value: number of vessels: N`
- `Save current workspace` label is now `workspaceUpdated?.name` (was `workspace?.name`)
- `Search`/`vessel group` value fields are now descriptive strings (`number of vessels: N`) rather than bare numbers

### Known defects

- `ShareWorkspaceButton.tsx:48` — action template ends in a stray `'}`, so GA records `Click share workspace'}`.
- `ReportVesselsTableFooter.tsx:111` — label contains `Groupd id:` (typo for `Group id:`).
- `map-interaction.utils.ts:65` — `category` and `action` are swapped relative to every other call site; map-click events land in GA with `category = "Map click on <x>"` and `action = "map_interaction"`.
