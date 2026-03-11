export const openGlobalReportAction = {
  pathname: '/fishing-activity/default-public/report/public-eez-areas/8311',
  type: 'WORKSPACE_REPORT',
  payload: {
    category: 'fishing-activity',
    workspaceId: 'default-public',
    datasetId: 'public-eez-areas',
    areaId: '8311',
  },
  query: {
    longitude: 158.7770691,
    latitude: -54.90904804,
    zoom: 5.20960877,
    dataviewInstances: [
      {
        id: 'context-layer-eez',
        config: {
          visible: true,
        },
      },
    ],
    bivariateDataviews: null,
  },
}
