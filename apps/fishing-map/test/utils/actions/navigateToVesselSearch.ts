export const navigateToVesselSearchAction = {
  type: 'WORKSPACE_SEARCH',
  query: {
    longitude: 26,
    latitude: 19,
    zoom: 1.49,
    lastTransmissionDate: '',
    firstTransmissionDate: '',
  },
  payload: {
    category: 'fishing-activity',
    workspaceId: 'default-public',
  },
  replaceQuery: false,
  replaceUrl: false,
  isHistoryNavigation: false,
  skipHistoryNavigation: false,
  meta: {
    location: {
      current: {
        pathname: '/fishing-activity/default-public/vessel-search',
        type: 'WORKSPACE_SEARCH',
        payload: {
          category: 'fishing-activity',
          workspaceId: 'default-public',
        },
        query: {
          longitude: 26,
          latitude: 19,
          zoom: 1.49,
          lastTransmissionDate: '',
          firstTransmissionDate: '',
        },
        search: 'longitude=26&latitude=19&zoom=1.49&lTD=&fTD=',
      },
      prev: {
        pathname: '/fishing-activity/default-public/vessel-search',
        type: 'WORKSPACE_SEARCH',
        payload: {
          category: 'fishing-activity',
          workspaceId: 'default-public',
        },
        query: {
          longitude: 26,
          latitude: 19,
          zoom: 1.49,
          lastTransmissionDate: '',
          firstTransmissionDate: '',
        },
        search: 'longitude=26&latitude=19&zoom=1.49&lTD=&fTD=',
      },
      kind: 'push',
    },
  },
}
