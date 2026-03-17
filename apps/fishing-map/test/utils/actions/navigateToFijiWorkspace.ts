export const navigateToFijiWorkspaceAction = {
  type: 'WORKSPACE',
  payload: {
    category: 'marine-manager',
    workspaceId: 'fiji-public',
  },
  query: {
    zoom: 5.2583859968801505,
    latitude: -17.716146387555632,
    longitude: 179.26220362598707,
  },
  replaceQuery: true,
  meta: {
    location: {
      current: {
        pathname: '/marine-manager/fiji-public',
        type: 'WORKSPACE',
        payload: {
          category: 'marine-manager',
          workspaceId: 'fiji-public',
        },
        query: {},
        search: 'zoom=5.2583859968801505&latitude=-17.716146387555632&longitude=179.26220362598707',
      },
      prev: {
        pathname: '/marine-manager',
        type: 'WORKSPACES_LIST',
        payload: {
          category: 'marine-manager',
        },
        query: {},
        search: undefined,
      },
      kind: 'push',
    },
  },
}

export const navigateToFijiWorkspaceWithAllLayersAction = {
  type: 'WORKSPACE',
  query: {
    zoom: 5.2583859968801505,
    latitude: -17.716146387555632,
    longitude: 179.26220362598707,
    start: '2024-03-16T00:00:00.000Z',
    end: '2026-03-16T00:00:00.000Z',
    dataviewInstances: [
      {
        id: 'basemap-labels',
        config: {
          visible: true,
        },
      },
      {
        id: 'context-layer-high-seas',
        config: {
          visible: true,
        },
      },
      {
        id: 'context-layer-rfmo',
        config: {
          visible: true,
        },
      },
      {
        id: 'context-layer-mpa',
        config: {
          visible: true,
        },
      },
      {
        id: 'context-layer-eez',
        config: {
          visible: true,
        },
      },
      {
        id: 'global-sea-surface-temperature',
        config: {
          visible: true,
        },
      },
      {
        id: 'global-water-salinity',
        config: {
          visible: true,
        },
      },
      {
        id: 'global-chlorophyl',
        config: {
          visible: true,
        },
      },
      {
        id: 'encounter-events',
        config: {
          visible: true,
        },
      },
      {
        id: 'sar-match',
        config: {
          visible: true,
        },
      },
      {
        id: 'viirs-match',
        config: {
          visible: true,
        },
      },
      {
        id: 'sentinel2',
        config: {
          visible: true,
        },
      },
      {
        id: 'presence',
        config: {
          visible: true,
        },
      },
    ],
    bivariateDataviews: null,
    timebarVisualisation: 'environment',
  },
  payload: {
    category: 'marine-manager',
    workspaceId: 'fiji-public',
  },
  replaceQuery: false,
  replaceUrl: false,
  isHistoryNavigation: false,
  skipHistoryNavigation: false,
  meta: {
    location: {
      current: {
        pathname: '/marine-manager/fiji-public',
        type: 'WORKSPACE',
        payload: {
          category: 'marine-manager',
          workspaceId: 'fiji-public',
        },
        query: {
          zoom: 5.2583859968801505,
          latitude: -17.716146387555632,
          longitude: 179.26220362598707,
          start: '2024-03-16T00:00:00.000Z',
          end: '2026-03-16T00:00:00.000Z',
          dataviewInstances: [
            {
              id: 'basemap-labels',
              config: {
                visible: true,
              },
            },
            {
              id: 'context-layer-high-seas',
              config: {
                visible: true,
              },
            },
            {
              id: 'context-layer-rfmo',
              config: {
                visible: true,
              },
            },
            {
              id: 'context-layer-mpa',
              config: {
                visible: true,
              },
            },
            {
              id: 'context-layer-eez',
              config: {
                visible: true,
              },
            },
            {
              id: 'global-sea-surface-temperature',
              config: {
                visible: true,
              },
            },
            {
              id: 'global-water-salinity',
              config: {
                visible: true,
              },
            },
            {
              id: 'global-chlorophyl',
              config: {
                visible: true,
              },
            },
            {
              id: 'encounter-events',
              config: {
                visible: true,
              },
            },
            {
              id: 'sar-match',
              config: {
                visible: true,
              },
            },
            {
              id: 'viirs-match',
              config: {
                visible: true,
              },
            },
            {
              id: 'sentinel2',
              config: {
                visible: true,
              },
            },
            {
              id: 'presence',
              config: {
                visible: true,
              },
            },
          ],
          bivariateDataviews: null,
          timebarVisualisation: 'environment',
        },
        search:
          'zoom=5.2583859968801505&latitude=-17.716146387555632&longitude=179.26220362598707&start=2024-03-16T00%3A00%3A00.000Z&end=2026-03-16T00%3A00%3A00.000Z&dvIn[0][id]=basemap-labels&dvIn[0][cfg][vis]=true&dvIn[1][id]=context-layer-high-seas&dvIn[1][cfg][vis]=true&dvIn[2][id]=context-layer-rfmo&dvIn[2][cfg][vis]=true&dvIn[3][id]=context-layer-mpa&dvIn[3][cfg][vis]=true&dvIn[4][id]=context-layer-eez&dvIn[4][cfg][vis]=true&dvIn[5][id]=global-sea-surface-temperature&dvIn[5][cfg][vis]=true&dvIn[6][id]=global-water-salinity&dvIn[6][cfg][vis]=true&dvIn[7][id]=global-chlorophyl&dvIn[7][cfg][vis]=true&dvIn[8][id]=encounter-events&dvIn[8][cfg][vis]=true&dvIn[9][id]=sar-match&dvIn[9][cfg][vis]=true&dvIn[10][id]=viirs-match&dvIn[10][cfg][vis]=true&dvIn[11][id]=sentinel2&dvIn[11][cfg][vis]=true&dvIn[12][id]=presence&dvIn[12][cfg][vis]=true&bDV&tV=environment',
      },
      prev: {
        pathname: '/marine-manager/fiji-public',
        type: 'WORKSPACE',
        payload: {
          category: 'marine-manager',
          workspaceId: 'fiji-public',
        },
        query: {
          zoom: 5.2583859968801505,
          latitude: -17.716146387555632,
          longitude: 179.26220362598707,
          start: '2024-03-16T00:00:00.000Z',
          end: '2026-03-16T00:00:00.000Z',
          dataviewInstances: [
            {
              id: 'context-layer-high-seas',
              config: {
                visible: true,
              },
            },
            {
              id: 'context-layer-rfmo',
              config: {
                visible: true,
              },
            },
            {
              id: 'context-layer-mpa',
              config: {
                visible: true,
              },
            },
            {
              id: 'context-layer-eez',
              config: {
                visible: true,
              },
            },
            {
              id: 'global-sea-surface-temperature',
              config: {
                visible: true,
              },
            },
            {
              id: 'global-water-salinity',
              config: {
                visible: true,
              },
            },
            {
              id: 'global-chlorophyl',
              config: {
                visible: true,
              },
            },
            {
              id: 'encounter-events',
              config: {
                visible: true,
              },
            },
            {
              id: 'sar-match',
              config: {
                visible: true,
              },
            },
            {
              id: 'viirs-match',
              config: {
                visible: true,
              },
            },
            {
              id: 'sentinel2',
              config: {
                visible: true,
              },
            },
            {
              id: 'presence',
              config: {
                visible: true,
              },
            },
          ],
          bivariateDataviews: null,
          timebarVisualisation: 'environment',
        },
        search:
          'zoom=5.2583859968801505&latitude=-17.716146387555632&longitude=179.26220362598707&start=2024-03-16T00%3A00%3A00.000Z&end=2026-03-16T00%3A00%3A00.000Z&dvIn[0][id]=context-layer-high-seas&dvIn[0][cfg][vis]=true&dvIn[1][id]=context-layer-rfmo&dvIn[1][cfg][vis]=true&dvIn[2][id]=context-layer-mpa&dvIn[2][cfg][vis]=true&dvIn[3][id]=context-layer-eez&dvIn[3][cfg][vis]=true&dvIn[4][id]=global-sea-surface-temperature&dvIn[4][cfg][vis]=true&dvIn[5][id]=global-water-salinity&dvIn[5][cfg][vis]=true&dvIn[6][id]=global-chlorophyl&dvIn[6][cfg][vis]=true&dvIn[7][id]=encounter-events&dvIn[7][cfg][vis]=true&dvIn[8][id]=sar-match&dvIn[8][cfg][vis]=true&dvIn[9][id]=viirs-match&dvIn[9][cfg][vis]=true&dvIn[10][id]=sentinel2&dvIn[10][cfg][vis]=true&dvIn[11][id]=presence&dvIn[11][cfg][vis]=true&bDV&tV=environment',
      },
      kind: 'push',
    },
  },
}
