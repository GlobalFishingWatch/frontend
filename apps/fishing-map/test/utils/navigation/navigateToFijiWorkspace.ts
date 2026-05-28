import { ROUTE_PATHS } from 'router/routes.utils'
import type { QueryParams } from 'types'

import type { NavigationConfig } from './navigation-config'

const FIJI_WORKSPACE_SEARCH = {
  zoom: 5.2583859968801505,
  latitude: -17.716146387555632,
  longitude: 179.26220362598707,
} as QueryParams

export function navigateToFijiWorkspace(): NavigationConfig<typeof ROUTE_PATHS.WORKSPACE> {
  return {
    to: ROUTE_PATHS.WORKSPACE,
    params: {
      category: 'marine-manager',
      workspaceId: 'fiji-public',
    },
    search: FIJI_WORKSPACE_SEARCH,
    replace: true,
  }
}

export function getRouteToFijiWorkspaceWithAllLayers(): NavigationConfig<
  typeof ROUTE_PATHS.WORKSPACE
> {
  return {
    to: ROUTE_PATHS.WORKSPACE,
    params: {
      category: 'marine-manager',
      workspaceId: 'fiji-public',
    },
    search: {
      zoom: 5.2583859968801505,
      latitude: -17.716146387555632,
      longitude: 179.26220362598707,
      start: '2024-03-16T00:00:00.000Z',
      end: '2026-03-16T00:00:00.000Z',
      dataviewInstances: [
        { id: 'basemap-labels', config: { visible: true } },
        { id: 'context-layer-high-seas', config: { visible: true } },
        { id: 'context-layer-rfmo', config: { visible: true } },
        { id: 'context-layer-mpa', config: { visible: true } },
        { id: 'context-layer-eez', config: { visible: true } },
        { id: 'global-sea-surface-temperature', config: { visible: true } },
        { id: 'global-water-salinity', config: { visible: true } },
        { id: 'global-chlorophyl', config: { visible: true } },
        { id: 'encounter-events', config: { visible: true } },
        { id: 'sar-match', config: { visible: true } },
        { id: 'viirs-match', config: { visible: true } },
        { id: 'sentinel2', config: { visible: true } },
        { id: 'presence', config: { visible: true } },
      ],
      bivariateDataviews: null,
      timebarVisualisation: 'environment',
    },
  }
}
