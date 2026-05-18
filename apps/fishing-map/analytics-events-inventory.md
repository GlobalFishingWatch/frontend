# Google Analytics `trackEvent` Inventory

> **fishing-map** (frontend monorepo) — Generated: 2026-05-13

---

## Analytics & Page Tracking

- **`app/analytics.hooks.ts:52`**
  - Action: `'general'`
  - Label: _n/a_ (uses `other` with `pagetype`, `language`, `user_login_state`, `user_id`, `organization_type`, `country`, `user_cohort`, `user_group`)

---

## User Management

- **`user/user.slice.ts:65`**
  - Action: `'login'`
  - Label: _n/a_ (uses `other` with `user_id`)

---

## Sidebar

- **`sidebar/SidebarHeader.tsx:118`**
  - Action: `'Toggle search type to filter results'`
  - Label: `option.id`

- **`sidebar/CategoryTabs.tsx:98`**
  - Action: `` `clicked on ${category}` ``

- **`sidebar/CategoryTabs.tsx:107`**
  - Action: `'Click search icon to open search panel'`

- **`sidebar/buttons/ShareWorkspaceButton.tsx:45`**
  - Action: `` `Click share ${trackEventActions[location]}` ``

- **`sidebar/buttons/NavigationHistoryButton.tsx:71`**
  - Action (dynamic, one of):
    - `close_vessel_panel`
    - `close_report_panel`
    - `close_vessel_group_report_panel`
    - `close_workspace`

---

## Workspace Management

- **`workspaces-list/WorkspaceWizard.tsx:85`**
  - Action: `'Uses marine manager workspace wizard'`
  - Label: `getEventLabel([inputSearch, selectedItem?.properties?.name || ''])`

- **`workspaces-list/WorkspacesList.tsx:43`**
  - Action: `` `Clicked highlighted ${workspace.reportCategory} workspace` ``
  - Label: `workspace.name`

- **`workspace/save/WorkspaceCreateModal.tsx:171`**
  - Action: `'Save current workspace'`
  - Label: `workspace?.name ?? 'Unknown'`

- **`workspace/save/WorkspaceEdit.tsx:97`**
  - Action: `'Edit current workspace'`
  - Label: `dispatchedAction.payload?.name ?? 'Unknown'`

---

## Downloads

- **`download/DownloadTrackModal.tsx:73`**
  - Action: `'Track download'`
  - Label: `downloadTrackName`

- **`download/DownloadActivityGridded.tsx:164`**
  - Action: `'Download GeoTIFF file'`
  - Label: `JSON.stringify({regionName, downloadType: 'gridded activity', groupBy, temporalResolution, spatialResolution, sourceNames})`

- **`download/DownloadActivityGridded.tsx:179`**
  - Action: `` `Download ${format} file` ``
  - Label: `JSON.stringify({regionName, downloadType: 'gridded activity', spatialResolution, groupBy, temporalResolution, sourceNames})`

- **`download/DownloadActivityGridded.tsx:212`**
  - Action: `'Activity download'`
  - Label: `getEventLabel([downloadParams.areaName, ...downloadDataviews.map(...)])`

- **`download/DownloadActivityEnvironment.tsx:141`**
  - Action: `'Download GeoTIFF file'`
  - Label: `JSON.stringify({regionName, downloadType: 'environment', spatialResolution, temporalResolution, sourceNames})`

- **`download/DownloadActivityEnvironment.tsx:155`**
  - Action: `` `Download ${format} file` ``
  - Label: `JSON.stringify({regionName, downloadType: 'environment', spatialResolution, temporalResolution, sourceNames})`

- **`download/DownloadActivityEnvironment.tsx:186`**
  - Action: `'Activity download'`
  - Label: `getEventLabel([downloadParams.areaName, ...downloadDataviews.map(...)])`

- **`download/DownloadActivityByVessel.tsx:122`**
  - Action: `` `Download ${format.toUpperCase()} file` ``
  - Label: `JSON.stringify({regionName, downloadType: 'active vessels', temporalResolution, groupBy, sourceNames})`

- **`download/DownloadActivityByVessel.tsx:153`**
  - Action: `'Activity download'`
  - Label: `getEventLabel([downloadAreaName || EMPTY_FIELD_PLACEHOLDER, ...downloadDataviews.map(...)])`

---

## Datasets & Reference Layers

- **`datasets/datasets.hook.ts:220`**
  - Action: `'Start uploading user dataset'`

- **`datasets/upload/NewDataset.tsx:138`**
  - Action: `` `Confirm ${datasetMetadata.configuration?.frontend?.geometryType} upload` ``
  - Label: `datasetMetadata?.name`

- **`layer-library/LayerLibraryUserPanel.tsx:89`**
  - Action: `'Draw a custom reference layer - Start'`

- **`layer-library/LayerLibraryItem.tsx:96`**
  - Action: `` `add ${category} layer to workspace` ``
  - Label: ``getEventLabel([`layer_id: ${id}`])``

- **`map/overlays/draw/DrawDialog.tsx:118`**
  - Action: `'Draw a custom reference layer - Click dismiss'`

- **`map/overlays/draw/DrawDialog.tsx:173`**
  - Action: `'Draw a custom reference layer - Click save'`

- **`map/overlays/draw/DrawDialog.tsx:184`**
  - Action: `'Draw a custom reference layer - Click + icon'`

---

## Workspace Sections (Layer Toggling)

- **`workspace/vessel-groups/VesselGroupsSection.tsx:48`**
  - Action: `'Click to add vessel group to workspace'`

- **`workspace/vessel-groups/VesselGroupsSection.tsx:55`**
  - Action: `'Open panel to add a reference layer'`
  - Label: _n/a_ (value: `userDatasets.length`)

- **`workspace/user/UserSection/UserSection.tsx:69`**
  - Action: `'Draw a custom reference layer - Start'`

- **`workspace/user/UserSection/UserSection.tsx:80`**
  - Action: `'Open panel to upload new reference layer'`
  - Label: _n/a_ (value: `userDatasets.length`)

- **`workspace/user/UserSection/UserSection.tsx:89`**
  - Action: `'Open panel to add a reference layer'`
  - Label: _n/a_ (value: `userDatasets.length`)

- **`workspace/user/UserSection/UserSection.tsx:105`**
  - Action: `'Toggle reference layer'`
  - Label: `getEventLabel([action, layerTitle])`

- **`workspace/context-areas/ContextAreaSection.tsx:39`**
  - Action: `'Open panel to add a reference layer'`
  - Label: _n/a_ (value: `userDatasets.length`)

- **`workspace/context-areas/ContextAreaSection.tsx:55`**
  - Action: `'Toggle reference layer'`
  - Label: `getEventLabel([action, layerTitle])`

- **`workspace/events/EventsSection.tsx:41`**
  - Action: `` `Toggle ${dataview.category} layer` ``
  - Label: `getEventLabel([action, dataview.id])`

- **`workspace/detections/DetectionsSection.tsx:72`**
  - Action: `'Click on bivariate option'`
  - Label: `getEventLabel(['combine', dataview1.name ?? dataview1.id, getActivitySources(dataview1), ...getActivityFilters(dataview1.config?.filters), dataview2.name ?? dataview2.id, getActivitySources(dataview2), ...getActivityFilters(dataview2.config?.filters)])`

- **`workspace/detections/DetectionsSection.tsx:93`**
  - Action: `` `Toggle ${dataview.category} layer` ``
  - Label: `getEventLabel([action, getActivitySources(dataview), ...getActivityFilters(dataview.config?.filters)])`

- **`workspace/activity/ActivitySection.tsx:78`**
  - Action: `'Click on bivariate option'`
  - Label: `getEventLabel(['combine', dataview1.name ?? dataview1.id, getActivitySources(dataview1), ...getActivityFilters(dataview1.config?.filters), dataview2.name ?? dataview2.id, getActivitySources(dataview2), ...getActivityFilters(dataview2.config?.filters)])`

- **`workspace/activity/ActivitySection.tsx:99`**
  - Action: `` `Toggle ${dataview.category} layer` ``
  - Label: `getEventLabel([action, getActivitySources(dataview), ...getActivityFilters(dataview.config?.filters)])`

- **`workspace/activity/ActivityLayerPanel.tsx:112`**
  - Action: `'Click on bivariate option'`
  - Label: `getEventLabel(['split', dataview.name ?? dataview.id ?? bivariateDataviews[0], getActivitySources(dataview), ...getActivityFilters(dataview.config?.filters), bivariateDataviews[1]])`

- **`workspace/shared/LayerFilters.tsx:59`**
  - Action: `` `Click on ${filterKey} filter` ``
  - Label: `label` _(variable)_

- **`workspace/shared/LayerFilters.tsx:372`**
  - Action: `` `Click on ${filterKey} filter` ``
  - Label: `getEventLabel(['deselect', getActivitySources(dataview), ...getActivityFilters({ [filterKey]: filterValue ?? [] })])`

- **`workspace/shared/LayerFilters.tsx:394`**
  - Action: `` `Click on ${filterKey} filter` ``
  - Label: `getEventLabel(['clear', getActivitySources(dataview)])`

- **`workspace/shared/InfoModal.tsx:91`**
  - Action: `'clicked on info popup'`
  - Label: `` `${dataview.name} - ${dataset?.name}` ``

- **`workspace/vessels/VesselInfoCorrection.tsx:23`**
  - Action: `'click vessel correction modal'`

- **`workspace/vessels/VesselsSection.tsx:119`**
  - Action: `'add_to_vessel_group_from_workspace'`
  - Label: `` `${vesselGroupId}` ``

- **`workspace/vessels/VesselsSection.tsx:150`**
  - Action: `'Click search icon to open search panel'`

---

## Environmental

- **`workspace/environmental/EnvironmentalSection.tsx:59`**
  - Action: `'Open panel to add a environmental dataset'`
  - Label: _n/a_ (value: `userDatasets.length`)

- **`workspace/environmental/EnvironmentalSection.tsx:73`**
  - Action: `'Toggle environmental layer'`
  - Label: `getEventLabel([action, layerTitle])`

- **`workspace/environmental/HistogramRangeFilter.tsx:52`**
  - Action: `'Filter environmental layer'`
  - Label: `getEventLabel([dataview.name as string, ...rangeSelected.map((r) => r.toString())])`

---

## Vessel Profile

- **`vessel/VesselHeader.tsx:67`**
  - Action: `'click_vessel_header_actions'`
  - Label: `label` _(variable)_

- **`vessel/VesselHeader.tsx:75`**
  - Action: `'add_to_vessel_group_from_vessel_profile'`
  - Label: `` `${vesselGroupId}` `` _(value: number of vessel identities in group)_

- **`vessel/Vessel.tsx:198`**
  - Action: `` `click_${tab.id}_tab` ``

- **`vessel/VesselLink.tsx:105`**
  - Action: `'vessel profile link click'`
  - Label: `` `vesselId: ${vesselId} | datasetId: ${datasetId} | source: ${identity?.sourceCode?.join(', ')}` ``

- **`vessel/VesselPin.tsx:181`**
  - Action: `'Click in vessel from grid cell panel'`
  - Label: `getEventLabel([infoDataset?.id || '', getVesselId(vesselWithIdentity)])`

- **`vessel/identity/VesselIdentity.tsx:83`**
  - Action: `'click_vessel_source_tab'`
  - Label: `tab.id`

- **`vessel/identity/VesselIdentity.tsx:131`**
  - Action: `'vessel_identity_download'`
  - Label: `identitySource`

- **`vessel/identity/VesselIdentity.tsx:349`**
  - Action: `'click_marine_traffic_link'`

- **`vessel/identity/VesselIdentity.tsx:362`**
  - Action: `'click_skylight_link'`

- **`vessel/identity/VesselIdentity.tsx:375`**
  - Action: `'click_triton_link'`

- **`vessel/identity/VesselIdentity.tsx:388`**
  - Action: `'click_cravt_link'`

- **`vessel/identity/VesselIdentitySelector.tsx:58`**
  - Action: `` `change_timeperiod_${identitySource}_tab` ``
  - Label: `` `${identityIndex + 1} | ${start} - ${end}` ``

- **`vessel/identity/DataTerminology.tsx:47`**
  - Action: `` `open_vessel_info_${vesselSection}_tab` ``
  - Label: `terminologyKey`

- **`vessel/vesselCorrection/VesselCorrectionModal.tsx:115`**
  - Action: `'send_vessel_info_correction'`

- **`vessel/related-vessels/RelatedVessels.tsx:43`**
  - Action: `` `click_${option.id}_related_vessels_tab` ``

- **`vessel/areas/VesselAreas.tsx:167`**
  - Action: `` `click_${option.id}_areas_tab` ``

- **`vessel/activity/VesselActivity.tsx:38`**
  - Action: `` `click_activity_by_${option.id}_summary_tab` ``

- **`vessel/activity/VesselActivityDownload.tsx:43`**
  - Action: `'vessel_events_download'`
  - Label: `` `${vesselSection}_tab` ``

- **`vessel/activity/activity-by-type/ActivityByType.tsx:68`**
  - Action: `'View list of events by activity type'`
  - Label: `JSON.stringify({ type })`

---

## Vessel Groups

- **`vessel-groups/VesselGroupModal.tsx:228`**
  - Action: `` `match vessels from ${ids ? 'IDs' : csvData && 'CSV'} to create a vessel group` ``
  - Label: ``getEventLabel([transmissionDateFrom && `active after: ${transmissionDateFrom}`, transmissionDateTo && `active before: ${transmissionDateTo}`, datasets && `datasets: ${datasets.join(', ')}`, searchIdField && `id field: ${searchIdField}`])``

- **`vessel-groups/VesselGroupModal.tsx:427`**
  - Action: `` `${editingVesselGroupId ? 'Edit' : 'Create new'} vessel group` ``
  - Label: ``getEventLabel([`vessel_id: ${vesselGroupId}`, calculateVMSVesselsPercentage(vesselGroupVessels)])`` _(value: number of vessels)_

- **`vessel-groups/VesselGroupModalSearch.tsx:140`**
  - Action: `'click see csv format link in vessel group modal'`

---

## Search

- **`search/search.hook.ts:167`**
  - Action: `searchType === 'basic' ? 'Search specific vessel' : 'add_filters_and_hit_search_in_advanced_search'`
  - Label: `query` _(value: `total`)_

- **`search/search.hook.ts:252`**
  - Action: `'Add filters to refine Advanced Search'`
  - Label: `` `name: ${debouncedQuery} | MMSI: ${searchFilters.ssvid} | IMO: ${searchFilters.imo} | Call Sign: ${searchFilters.callsign} | Owner: ${searchFilters.owner} | Info source: ${searchFilters.infoSource} | Sources: ${searchFilters.sources} | Flag: ${searchFilters.flag} | Active After: ${searchFilters.transmissionDateFrom} | Active Before: ${searchFilters.transmissionDateTo}` ``

- **`search/SearchActions.tsx:68`**
  - Action: `'Click view on map'`
  - Label: `` `${activeSearchOption} search` ``

- **`search/SearchActions.tsx:87`**
  - Action: `vesselGroupId === NEW_VESSEL_GROUP_ID ? 'create_new_vessel_group_from_search' : 'add_vessels_to_vessel_group_from_search'`
  - Label: `` `${activeSearchOption} search` `` _(value: number of vessel added to group)_

- **`search/SearchDownload.tsx:42`**
  - Action: `'Download CSV list of vessels from advanced search'`
  - Label: `JSON.stringify(vesselsParsed.map({name, mmsi, imo, callsign, owner, flag, vessel type, gear type, transmissions, activeAfter, activeBefore, sources}))`

---

## Map Popups

- **`map/popups/categories/VesselsTable.tsx`**
  - Action: `` `Clicked see vessel from ${feature?.category}` ``
  - Label: ``getEventLabel([`source: ${source}`])``

  - Action: `click_skylight_search_from_popup`

  - Action: `click_skylight_link_from_popup`

- **`map/popups/categories/ContextLayers.tsx:30`**
  - Action: `'Click on polygon, click on download icon'`

- **`map/popups/categories/ContextLayers.hooks.ts:68`**
  - Action: `'Open report'`
  - Label: `getEventLabel([value?.toString(), layerSources ? 'active layer sources: ' + layerSources : ''])`

- **`map/popups/categories/EventsPortVisitTooltipRow.tsx:46`**
  - Action: `'Clicked see port report'`
  - Label: ``getEventLabel([` dataset: ${port?.datasetId} `, ` port_id: ${port?.id} `].filter(Boolean))``

- **`map/popups/categories/EventsGapTooltipRow.tsx:50`**
  - Action: `'Clicked see gap event'`
  - Label: ``getEventLabel([` dataset_name: ${dataset.name} `, ` source: ${dataset.source} `, dataset.id].filter(Boolean))``

- **`map/popups/categories/EventsEncounterTooltipRow.tsx:64`**
  - Action: `'Clicked see encounter event'`
  - Label: ``getEventLabel([` dataset_name: ${dataset.name} `, ` source: ${dataset.source} `, dataset.id].filter(Boolean))``

- **`map/popups/categories/EventsClusterRow.tsx:48`**
  - Action: `'Clicked see loitering event'`
  - Label: ``getEventLabel([` dataset_name: ${dataset.name} `, ` source: ${dataset.source} `, dataset.id].filter(Boolean))``

- **`map/map-interactions.hooks.ts:305`** — fires one event per clicked feature, built by `getAnalyticsEvent(feature)` in [`map/map-interaction.utils.ts:29`](apps/fishing-map/features/map/map-interaction.utils.ts#L29). For every event:
  - Action: `'map_interaction'` _(constant — `TrackCategory.MapInteraction`)_
  - Category: `` `Map click on ${feature.category}` `` _(e.g. `Map click on activity`, `Map click on vessels`, `Map click on events`, `Map click on context`, `Map click on user`, `Map click on workspaces`, `Map click on detections`)_
  - Label _(varies by `feature.category`)_:
    - **Activity / Detections** (positions mode): `` `visualization_mode: positions | vessel_name: ${feature.title} | vessel_id: ${feature.properties.id}` ``
    - **Activity / Detections** (other modes): `` `visualization_mode: ${feature.visualizationMode} | time_interval: ${feature.interval}` ``
    - **Vessels**: `` `event_type: ${feature.type} | vessel_id: ${feature.vesselId}` ``
    - **Events**: `` `event_type: ${feature.eventType} | datasetId : ${feature.datasetId}` ``
    - **Context / User**: `` `${feature.value}` ``
    - **Workspaces**: `` `${feature.properties.category} | ${feature.properties.label}` ``

---

## Timebar

- **`timebar/Timebar.tsx:211`**
  - Action: `'Bookmark timerange'`
  - Label: `'removed'`

- **`timebar/Timebar.tsx:219`**
  - Action: `'Bookmark timerange'`
  - Label: `getEventLabel([start, end])`

- **`timebar/Timebar.tsx:276`**
  - Action: `gaActions[e.source]` _(dynamic)_
  - Label: `getEventLabel([e.start, e.end])`

- **`timebar/Timebar.tsx:331`**
  - Action: `` `Click on ${isPlaying ? 'Play' : 'Pause'}` ``
  - Label: `getEventLabel([start ?? '', end ?? ''])`

- **`timebar/TimebarSettings.tsx:94`**
  - Action: `'Open timebar settings'`
  - Label: ``getEventLabel([`visualization: ${timebarVisualisation}`])``

- **`timebar/TimebarSettings.tsx:107`**
  - Action: `'select_timebar_settings'`
  - Label: `` `${section}` ``

- **`timebar/TimebarSettings.tsx:117`**
  - Action: `'select_timebar_settings'`
  - Label: `` `${TimebarVisualisations.Environment} - ${environmentalDataviewId}` ``

- **`timebar/TimebarSettings.tsx:126`**
  - Action: `'select_timebar_settings'`
  - Label: `` `${TimebarVisualisations.Points} - ${userPointsDataviewId}` ``

- **`timebar/TimebarSettings.tsx:136`**
  - Action: `'select_timebar_settings'`
  - Label: `` `${TimebarVisualisations.VesselGroup} - ${vesselGroupDataviewId}` ``

- **`timebar/TimebarSettings.tsx:145`**
  - Action: `'select_timebar_settings'`
  - Label: `` `${TimebarVisualisations.Vessel} - ${TimebarGraphs.None}` ``

- **`timebar/TimebarSettings.tsx:155`**
  - Action: `'select_timebar_settings'`
  - Label: `` `${TimebarVisualisations.Vessel} - ${timebarGraph}` ``

---

## Reports — Activity

- **`reports/tabs/activity/ReportActivity.tsx:304`**
  - Action: `'Click on see vessels button in report activity'`

- **`reports/tabs/activity/ReportActivitySubsectionSelector.tsx:98`**
  - Action: `` `activity_tab_toggle_${option.id}` ``

- **`reports/tabs/activity/ReportActivityGraphSelector.tsx:107`**
  - Action: `` `Click on ${option.id} activity graph` ``

- **`reports/tabs/activity/ReportActivityPeriodComparison.tsx:39`**
  - Action: `"Select comparison date in 'period comparison'"`
  - Label: `JSON.stringify({date: date.target.value, regionName: reportArea?.name, sourceNames: dataviews.flatMap(...)})`

- **`reports/tabs/activity/ReportActivityPeriodComparison.tsx:54`**
  - Action: `"Select baseline date in 'period comparison'"`
  - Label: `JSON.stringify({date: date.target.value, regionName: reportArea?.name, sourceNames: dataviews.flatMap(...)})`

- **`reports/tabs/activity/ReportActivityPeriodComparison.tsx:69`**
  - Action: `"Select duration in 'period comparison'"`
  - Label: `JSON.stringify({duration: duration?.target?.value + ' ' + durationTypeOption?.label, regionName: reportArea?.name, sourceNames: dataviews.flatMap(...)})`

- **`reports/tabs/activity/ReportActivityPeriodComparison.tsx:84`**
  - Action: `"Select duration in 'period comparison'"`
  - Label: `JSON.stringify({duration: timeComparison?.duration + ' ' + duration?.label, regionName: reportArea?.name, sourceNames: dataviews.flatMap(...)})`

- **`reports/tabs/activity/ReportActivityBeforeAfter.tsx:37`**
  - Action: `"Select date in 'before/after'"`
  - Label: `JSON.stringify({date, regionName, sourceNames})`

- **`reports/tabs/activity/ReportActivityBeforeAfter.tsx:52`**
  - Action: `"Select duration in 'before/after'"`
  - Label: `JSON.stringify({duration, durationAmount, durationType, regionName, sourceNames})`

- **`reports/tabs/activity/ReportActivityBeforeAfter.tsx:69`**
  - Action: `"Select duration in 'before/after'"`
  - Label: `JSON.stringify({duration, durationAmount, durationType, regionName, sourceNames})`

- **`reports/tabs/activity/download/ReportDownload.tsx:23`**
  - Action: `'Download report'`
  - Label: `areaId?.toString()`

---

## Reports — Events

- **`reports/tabs/events/EventsReportGraphSelector.tsx:71`**
  - Action: `` `Click on ${option.id} activity graph` ``

- **`reports/tabs/events/EventsReportSubsectionSelector.tsx:74`**
  - Action: `` `vessel_group_profile_events_tab_${option.id}_graph` ``

- **`reports/tabs/events/EventsReport.tsx:184`**
  - Action: `'Click on see vessels button in events activity'`

- **`reports/tabs/events/EventsReportDownload.tsx:43`**
  - Action: `'events_report_download'`
  - Label: `` `${reportEventsSubCategory}_tab` ``

- **`reports/tabs/events/EventReportPorts.tsx:68`**
  - Action: `'Clicked see ports after events'`

---

## Reports — Environment

- **`reports/tabs/environment/ReportEnvironmentGraphSelector.tsx:61`**
  - Action: `` `Click on ${option.id} environmental graph` ``

- **`reports/tabs/environment/ReportEnvironment.tsx:47`**
  - Action: `'Open panel to add a report layer'`

---

## Reports — Vessels (Shared)

- **`reports/shared/vessels/ReportVesselsTable.tsx:71`**
  - Action: `'redirect to vessel profile'`
  - Label: `shipName`

- **`reports/shared/vessels/ReportVesselsTable.tsx:93`**
  - Action: `'vessel_report_pin_vessel'`
  - Label: `vesselId`

- **`reports/shared/vessels/ReportVesselsTableFooter.tsx:109`**
  - Action: `'vessel_report_download_csv'`
  - Label: ``getEventLabel([`Groupd id: ${vesselGroup?.id}`, `start date: ${start}`, `end date: ${end}`])`` _(value: number of vessel identities)_

- **`reports/shared/vessels/ReportVesselsTableFooter.tsx:133`**
  - Action: `'Click on show more vessels'`

- **`reports/shared/vessels/ReportVesselsTableFooter.tsx:143`**
  - Action: `'Click on show less vessels'`

- **`reports/shared/vessels/ReportVesselsTableFooter.tsx:151`**
  - Action: `'add_to_vessel_group'`
  - Label: `'report'`

- **`reports/shared/vessels/ReportVesselsGraphSelector.tsx:113`**
  - Action: `` `vessel_report_group_by_${option.id}` ``

- **`reports/shared/vessels/ReportVesselsFilter.tsx:49`**
  - Action: `` `Type search into vessel list from ${locationType}` ``
  - Label: `debouncedQuery`

- **`reports/shared/summary/ReportSummary.tsx:47`**
  - Action: `'Open panel to add a report layer'`

- **`reports/shared/new-report-modal/NewAreaReportModal.tsx:92`**
  - Action: `'Edit current report'`
  - Label: `dispatchedAction.payload?.name ?? 'Unknown'`

- **`reports/shared/new-report-modal/NewAreaReportModal.tsx:128`**
  - Action: `'Save current report'`
  - Label: `name || 'Unknown'`

- **`reports/shared/area-search/AreaReportSearch.tsx:155`**
  - Action: `'Search for an area in report'`
  - Label: `getEventLabel([inputValue, selectedItem?.properties?.name || ''])`

---

## Reports — Area

- **`reports/report-area/AreaReport.tsx:180`**
  - Action: `` `Click on ${option.id} report` ``

- **`reports/report-area/title/ReportTitle.tsx:113`**
  - Action: `'Click print/save as pdf'`

- **`reports/report-area/title/ReportTitle.tsx:154`**
  - Action: `'Confirm area buffer'`
  - Label: `` `${previewBuffer.value} ${previewBuffer.unit} ${previewBuffer.operation}` ``

---

## Reports — Vessel Group

- **`reports/report-vessel-group/VesselGroupReportLink.tsx:25`**
  - Action: `'access_vessel_group_profile'`
  - Label: _n/a_ (uses `other` with `vesselGroupId`)

- **`reports/report-vessel-group/VesselGroupReport.tsx:114`**
  - Action: `` `access_vessel_group_${tab.id}_tab` ``
  - Label: `getEventLabel([vesselGroup?.id, timeRange?.start || '', timeRange?.end || ''])`

---

## Reports — VGR Insights

- **`reports/tabs/vessel-group-insights/VGRInsightMOU.tsx:48`**
  - Action: `'vessel_group_profile_insights_mou_go_to_vessel'`
  - Label: `vesselId`

- **`reports/tabs/vessel-group-insights/VGRInsightMOU.tsx:120`**
  - Action: `'vessel_group_profile_insights_tab_expand_insights'`
  - Label: `` `${country} ${list} expanded` ``

- **`reports/tabs/vessel-group-insights/VGRInsightIUU.tsx:39`**
  - Action: `'vessel_group_profile_insights_tab_expand_insights'`
  - Label: `'IUU expanded'`

- **`reports/tabs/vessel-group-insights/VGRInsightGaps.tsx:46`**
  - Action: `'vessel_group_profile_insights_tab_expand_insights'`
  - Label: `'gaps expanded'`

- **`reports/tabs/vessel-group-insights/VGRInsightGaps.tsx:55`**
  - Action: `'vessel_group_profile_insights_gaps_go_to_vessel'`
  - Label: `vesselId`

- **`reports/tabs/vessel-group-insights/VGRInsightFlagChange.tsx:46`**
  - Action: `'vessel_group_profile_insights_tab_expand_insights'`
  - Label: `'flag changes expanded'`

- **`reports/tabs/vessel-group-insights/VGRInsightFlagChange.tsx:55`**
  - Action: `'vessel_group_profile_insights_flag_changes_go_to_vessel'`
  - Label: `vesselId`

- **`reports/tabs/vessel-group-insights/VGRInsightFishing.tsx:61`**
  - Action: `'vessel_group_profile_insights_tab_expand_insights'`
  - Label: `'fishing in no-take MPAs expanded'`

- **`reports/tabs/vessel-group-insights/VGRInsightFishing.tsx:77`**
  - Action: `'vessel_group_profile_insights_tab_expand_insights'`
  - Label: `'fishing Regional Fisheries Bodies (RFMOs) expanded'`

- **`reports/tabs/vessel-group-insights/VGRInsightFishing.tsx:86`**
  - Action: `'vessel_group_profile_insights_fishing_go_to_vessel'`
  - Label: `vesselId`

---

## i18n

- **`i18n/LanguageToggle.tsx:38`**
  - Action: `'Change language'`
  - Label: `lang`

---

## Help

- **`help/UserGuideLink.tsx:76`**
  - Action: `'redirect to user guide to specific section'`
  - Label: `` `${i18n.language} - ${section}` ``

- **`help/HelpHub.tsx:30`**
  - Action: `"restore help hints after they've been dismissed"`
  - Label: `` `percentage of hints seen: ${percentageOfHintsSeen.toString()}%` ``

- **`help/HelpHub.tsx:56`**
  - Action: `` `redirect to ${destination}` ``
  - Label: `i18n.language`

- **`help/Hint.tsx:36`**
  - Action: `'Dismiss one specific help hint'`
  - Label: `id`

- **`help/Hint.tsx:48`**
  - Action: `'Dismiss all help hints before viewing all'`
  - Label: `id`

- **`help/Hint.tsx:57`**
  - Action: `'Click on a help hint to view supporting information'`
  - Label: `id`

- **`help/Hint.tsx:65`**
  - Action: `'clicked on help hint popup'`
  - Label: `id`
