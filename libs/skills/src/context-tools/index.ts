/**
 * Context tools of the assistant: the agent calls them when it needs to know what the page shows,
 * and the browser answers from its stores (apps/platform/features/assistant).
 *
 * - `AssistantContextToolOutputs` (below): what each tool returns, with the shapes in
 *   `types/<page>-context-tool.types.ts`. The app's tool functions are typed against it.
 * - `ASSISTANT_CONTEXT_TOOLS`: name → description the model reads. Every tool takes no input.
 *
 * gfw-agent declares them from here (src/mastra/tools/context-tools.ts): a change only reaches the
 * agent after a skills release and a version bump there.
 *
 * Type-only imports with `.js` extensions, no other runtime code: the `.d.ts` files are published
 * as they are, and gfw-agent resolves them with `nodenext`.
 */

import type {
  AssistantClickedFeature,
  AssistantContextToolUnavailable,
  AssistantHelpPage,
  AssistantMapView,
  AssistantPlacesPage,
  AssistantPortReport,
  AssistantReportActivity,
  AssistantReportArea,
  AssistantReportEvents,
  AssistantReportVessels,
  AssistantTimebar,
  AssistantUserResources,
  AssistantVesselActivity,
  AssistantVesselAreas,
  AssistantVesselGroup,
  AssistantVesselGroupInsights,
  AssistantVesselIdentityContext,
  AssistantVesselInsights,
  AssistantVesselRelated,
  AssistantVesselSearchResults,
  AssistantWorkspace,
  AssistantWorkspacesList,
} from './types/index.js'

export type * from './types/index.js'

/** Tool name → what it returns when the page has data */
export type AssistantContextToolOutputs = {
  get_workspace: AssistantWorkspace
  get_map_view: AssistantMapView
  get_clicked_feature: AssistantClickedFeature
  get_timebar: AssistantTimebar
  get_workspaces_list: AssistantWorkspacesList
  get_vessel_identity: AssistantVesselIdentityContext
  get_vessel_activity: AssistantVesselActivity
  get_vessel_areas: AssistantVesselAreas
  get_vessel_related: AssistantVesselRelated
  get_vessel_insights: AssistantVesselInsights
  get_report_area: AssistantReportArea
  get_report_activity: AssistantReportActivity
  get_report_vessels: AssistantReportVessels
  get_report_events: AssistantReportEvents
  get_vessel_group: AssistantVesselGroup
  get_vessel_group_insights: AssistantVesselGroupInsights
  get_port_report: AssistantPortReport
  get_places_page: AssistantPlacesPage
  get_vessel_search_results: AssistantVesselSearchResults
  get_help_page: AssistantHelpPage
  get_user_resources: AssistantUserResources
}

export type AssistantContextToolName = keyof AssistantContextToolOutputs

export type AssistantContextToolOutput<Name extends AssistantContextToolName> =
  AssistantContextToolOutputs[Name]

/** What the browser sends back to the agent for a tool call */
export type AssistantContextToolResult<Name extends AssistantContextToolName> =
  AssistantContextToolOutput<Name> | AssistantContextToolUnavailable

// ---------------------------------------------------------------------------------------------
// Descriptions
// ---------------------------------------------------------------------------------------------

const MAP_RULES =
  'Numbers are what the map renders, not report values: call them approximate and send the user to a report for exact figures. It only covers this viewport, never the rest of the world.'

export const ASSISTANT_CONTEXT_TOOLS = {
  get_workspace: [
    'Map routes. The open workspace beyond the map url: `id`, `name`, `state` (settings saved with the workspace that the url does not override) and `dataviewInstances` (layers on but not in the url state: workspace defaults the user did not change, with their full config: dataviewId, datasets, filters).',
    'Use it to resolve "this layer", "my workspace", or a layer the url state does not list.',
  ].join('\n'),
  get_map_view: [
    'Map routes. What is rendered in the viewport right now, for the current time range, read from the map layers (match them to the workspace by `dataviewId(s)`).',
    '- `areaName`: ocean / EEZ name at the map center. `bounds`: [west, south, east, north].',
    '- Heatmap layers (activity, detections, environment): one entry per sublayer, told apart by `datasets`, `filter` (SQL from its filters, e.g. "flag IN (\'FRA\')") and `vesselGroups`. Name sublayers by what they show ("French vessels"), not by id. Per sublayer: `cellsWithData` in view (0 = no data in this view), `min` / `max`, `total` (sum layers) or `mean` (average layers, e.g. environment), `maxValueAt` [lon, lat], `dataBbox`.',
    '- Positions layers: `vesselsInView` and `topVessels` (id, name, value).',
    '- Event clusters (encounters, loitering, port visits): `clustersInView`, `eventsInView`.',
    '- Context / user polygon layers: `areasInView` and `closestToCenter` areas (id, label).',
    '- Pinned vessels and user tracks: `trackBbox` (whole track, any date), `pointsInView` (0 = no data here for this time range), `bboxInView`, `firstInView` / `lastInView`, `speedKnotsInView`, vessel `eventsInView` by type.',
    '- `loaded: false`: the layer was still loading, its numbers are partial.',
    'Use it to answer what is or is not on screen and to frame views (zoom to `dataBbox`, `trackBbox`, `maxValueAt`).',
    MAP_RULES,
  ].join('\n'),
  get_clicked_feature: [
    'Map routes. The last point the user clicked on the map (`longitude`, `latitude`) and what its popup shows, or null when nothing is clicked:',
    '- heatmap cell (activity, detections, environment): `cellCenter`, value per sublayer and the top `vessels` there',
    '- event: type, dates, `position`, vessel, encountered vessel, port, `durationHrs`, `distanceFromShoreKm`, `nextPort` (port visited next, also `encounteredVesselNextPort`), encounter `authorization` (`status` and `rfmos` of the main vessel, `vessels`: each vessel by `id` with its `rfmos`; `authorized: false` = no public authorization found, not proof of illegal activity)',
    '- `trackPoint` of a vessel or user track: `timestamp`, `speedKnots`, `depthM` (negative = below sea level), `courseDeg`',
    '- currents / winds cell: `speed`, `directionDeg`, `unit`. Bathymetry contour: `elevationM`',
    '- position: vessel. Area: id, label.',
    'This is what "this point", "this cell", "this encounter", "this port visit", "here" on a track refer to.',
    MAP_RULES,
  ].join('\n'),
  get_timebar: [
    'Map routes. The timebar graph for the current `timeRange`: how things changed over time ("over the year", "each month", "when was the peak", "value at this date").',
    '- Heatmaps (activity, detections, vessel group, environment), events clusters and uploaded points: `layers`, one per sublayer (`id` = dataviewId, `unit`), the value ON SCREEN per `interval`: `total`, `mean`, `max` / `min` with their `date`, and `series` ([date, value]) or `monthly` (`total` for sum layers, `mean` for environment). `loading: true`: still computing.',
    '- `vessel` visualisation: `tracks` per vessel or uploaded track: `trackStart` / `trackEnd` (whole loaded track), `speedKnots` [date, mean, max] and `depthM` [date, mean, deepest] by `interval` (day or month), whether or not the speed / depth graph (`trackGraph`) is open.',
    'Only the current viewport and time range, like the map: approximate, send the user to a report for exact area figures.',
  ].join('\n'),
  get_workspaces_list:
    'Workspaces list page (`/map/<category>`). `category` and the workspaces listed: `id`, `name`, `description`, `category`. Open one with the workspace route.',
  get_vessel_identity: [
    'Vessel profile. Who the vessel is (registry authorizations and owners, not events: encounter authorization is in `get_vessel_activity` `latestEvents`): `shown` (the identity in the profile header: `shipname`, `flag`, `ssvid` (MMSI), `imo`, `callsign`, `shiptypes`, `geartypes`, `source` registry / selfReported, `from` / `to`) and `identities`, every identity over time with the same fields.',
    '`authorizations` (registry `sourceCode` with `dateFrom` / `dateTo`) and `owners` (`name`, `flag`, dates) where the registry has them. `status` is the profile load status.',
  ].join('\n'),
  get_vessel_activity: [
    'Vessel profile. Activity in the current `timeRange`: `eventsByType` counts (fishing, encounter, loitering, port_visit, gap), `voyages`, `fishingHours`, `regions` with events by type (eez, fao, rfmo, mpa: `id`, `name`, `events`), `mostVisitedPortCountries`, and the open profile `section`.',
    '`latestEvents`: the last encounters, loitering, port visits and gaps, most recent first (dates, `position`, `port`, `durationHrs`, `encounteredVessel`, `nextPort`, encounter `authorization`). `lastEvent`: where and when the vessel was last seen in the time range.',
  ].join('\n'),
  get_vessel_areas:
    'Vessel profile, areas tab. Events of the vessel in the current time range grouped by area (`region` id, `name`, `total` and counts per event type) for the `areaType` the tab shows (eez, fao, rfmo, mpa).',
  get_vessel_related:
    'Vessel profile, related vessels tab. Vessels encountered in the current time range (`id`, `shipname`, `flag`, `ssvid`, `encounters`). Owners are in `get_vessel_identity`.',
  get_vessel_insights: [
    'Vessel profile, insights tab, for the current time range, by insight: COVERAGE (`percentage`), GAP (AIS off: `events`, `eventsGapOff`), FISHING (`events`, `eventsInNoTakeMPAs`, `eventsInRFMOWithoutKnownAuthorization`), IUU list, FLAG-CHANGES and MOU lists (`totalTimesListed`, `totalTimesListedInThePeriod`, `valuesInThePeriod`).',
    '`status: loading` for an insight the page has not loaded yet: tell the user to open the insights tab. These are indicators, not proof of wrongdoing: say so when they look negative.',
  ].join('\n'),
  get_report_area:
    'Area report. The area (`datasetId`, `areaId`, `name`, `bounds`, buffer, `global`), the saved report if any, the open `category` / `subcategory` tab, `unit`, time range and time comparison settings.',
  get_report_activity: [
    'Area or vessel group report, activity tab (activity, detections, environment, user layers). The `graph` for the current time range, one entry per layer (`id`, `unit`): `interval`, `points`, `total`, `mean`, and `max` / `min` with their `date`.',
    '- Evolution: `series` ([date, value] per interval) or, for long ranges, `monthly` (`total` for sum layers such as hours or detections, `mean` for average layers such as environment).',
    '- Time comparison graphs (periodComparison, beforeAfter): `comparison` per layer: `baseline`, `comparison`, `change`, `changePercentage`, the totals the report shows. Periods are in `get_report_area` `timeComparison`.',
    '- `stats` per layer, over the whole area: `mean` / `min` / `max` (environment: the true extremes of the area), uploaded points `total` / `count`, polygons `contained` / `overlapping` / `areaCoverageRatio` / `topAreas`.',
    '`isLoading: true` = still computing. These are the report numbers: state them as exact. When the open report already covers the area and period asked ("month by month", "how did it change", "max", "average"), answer from it instead of navigating: `series` / `monthly` hold the evolution whatever graph is open.',
  ].join('\n'),
  get_report_vessels:
    'Area or vessel group report. The vessels table as filtered by the user: `total` vessels (`totalUnfiltered` before the table filter), `totalValue` in `unit`, vessel counts by `flags`, `geartypes` and `vesselTypes`, and the `top` vessels in table order (`id`, `datasetId`, `shipname`, `flag`, `ssvid`, `imo`, `geartype`, `vesselType`, `value`). Open a vessel profile with `id` + `datasetId`.',
  get_report_events:
    'Area, port or vessel group report, events tabs (encounters, loitering, port visits). Per events layer: `events`, `vessels`, `flags`, the graph `peak` (`date`, `value`) and `groups` (e.g. by flag). Plus `topVessels` (`id`, `datasetId`, `shipname`, `flag`, `events`) and `topPorts`.',
  get_vessel_group:
    'Vessel group report. The open group (`id`, `name`, `vessels` count), vessel counts by `flags`, the `timeRange` and the open `category` / `subcategory` tab. On this page "my group", "the group", "these vessels" mean this group: answer from it and the report tools (`get_report_activity` for fishing hours, `get_map_view` for where they fished), never from `get_user_resources`.',
  get_vessel_group_insights:
    'Vessel group report, insights tab, for the current time range: `coverage` (`meanPercentage`), `aisOff`, `fishingInNoTakeMpas`, `fishingInRfmoWithoutKnownAuthorization`, `iuuLists`, `flagChanges`, `mouLists`: each `{ vessels, top }` with the vessels flagged and their `value`, or `loading` when the tab has not loaded it. Indicators, not proof of wrongdoing: say so when they look negative.',
  get_port_report:
    'Port report. The port (`id`, `name`, `country`, `datasetId`), `timeRange` and its `footprint` area (`name`, `bounds`). Visits and vessels are in `get_report_events`.',
  get_places_page:
    'Ports or areas list page. `placeType` (port, eez, fao, mpa, rfmo), `count` places matching the search of `total`. The query and filters are in the map url state.',
  get_vessel_search_results:
    'Vessel search page. `status`, `total` matches and the first `results`: `id` + `datasetId` (to open a vessel profile), `shipname`, `flag`, `ssvid` (MMSI), `imo`, `callsign`, `shiptypes`, `geartypes`, `transmissionDateFrom` / `transmissionDateTo`, `selected` (ticked by the user: "these vessels", "my selection").',
  get_help_page:
    'Help hub. Landing: `sections` with their `articles`. Section page: `section`, the open `article` (`slug`, `title`, `description`) and `sectionArticles`. Link one as `#help-and-resources/<section>/<slug>`.',
  get_user_resources: [
    'Every page. What the user owns: `workspaces`, `datasets`, `vesselGroups`, `reports`, each `{ total, items }` with the most recent first (`total` counts all, `items` holds the first ones). `groups`: the user groups the user belongs to (user page, info tab), `groupsWithoutDatasetPermission`: groups whose private datasets the user cannot access yet.',
    '- Workspace: `id`, `name`, `category`, `visibility`. Dataset: `id`, `name`, `category`, `type`, `visibility` (uploaded by the user, to add as a layer). Vessel group: `id`, `name`, `vessels` count, `visibility`. Report: `id`, `name`, `areaId`, `datasetId`, `visibility`.',
    '- `visibility`: `public` (anyone with the link), `password` (workspaces: link + password) or `private` (only the user). Before suggesting to share a link, check it: a private resource, or a view using a private dataset, is not visible to others.',
    'Use it to resolve "my workspace", "my vessel group", "the dataset I uploaded" by name and open them by `id`, unless the page already shows that resource (vessel group report, workspace): then it is the open one. Never invent a resource that is not listed.',
  ].join('\n'),
} as const satisfies Record<AssistantContextToolName, string>
