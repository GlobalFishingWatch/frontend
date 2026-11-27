import type { AssistantContextModule, AssistantRouteId } from 'features/assistant/assistant-context'

const loadMap = () => import('features/_map/assistant/map-assistant-context')
const loadWorkspacesList = () =>
  import('features/_map/workspaces-list/assistant/workspaces-list-assistant-context')
const loadVessel = () => import('features/_vessels/vessel/assistant/vessel-assistant-context')
const loadAreaReport = () =>
  import('features/_reports/report-area/assistant/area-report-assistant-context')
const loadVesselGroupReport = () =>
  import('features/_reports/report-vessel-group/assistant/vessel-group-report-assistant-context')
const loadPortReport = () =>
  import('features/_reports/report-port/assistant/port-report-assistant-context')
const loadPlaces = () => import('features/_places/assistant/places-assistant-context')
const loadSearch = () =>
  import('features/_vessels/search/assistant/vessel-search-assistant-context')
const loadHelp = () => import('features/help/assistant/help-assistant-context')
const loadUser = () => import('features/_user/assistant/user-assistant-context')

export const ASSISTANT_CONTEXTS: Partial<
  Record<AssistantRouteId, () => Promise<AssistantContextModule>>
> = {
  '/_platform': loadUser,
  '/_platform/_map': loadMap,
  '/_platform/_map/map/$category/': loadWorkspacesList,
  '/_platform/_map/vessel/$vesselId': loadVessel,
  '/_platform/_map/map/$category/$workspaceId/vessel/$vesselId': loadVessel,
  '/_platform/_map/report/$reportId': loadAreaReport,
  '/_platform/_map/map/$category/$workspaceId/report/{-$datasetId}/{-$areaId}': loadAreaReport,
  '/_platform/_map/map/$category/$workspaceId/vessel-group-report/$vesselGroupId':
    loadVesselGroupReport,
  '/_platform/_map/ports/$portId': loadPortReport,
  '/_platform/_map/map/$category/$workspaceId/ports-report/$portId': loadPortReport,
  '/_platform/_content/ports': loadPlaces,
  '/_platform/_content/areas/$placeType': loadPlaces,
  '/_platform/_content/vessel-search': loadSearch,
  '/_platform/_content/help-and-resources/': loadHelp,
  '/_platform/_content/help-and-resources/$sectionSlug/{-$itemSlug}': loadHelp,
}
