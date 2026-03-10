export const openReportAction = {
  type: 'WORKSPACE_REPORT',
  payload: {
    category: 'fishing-activity',
    workspaceId: 'default-public',
    datasetId: 'public-eez-areas',
    areaId: '8361',
  },
  query: {
    longitude: -28.09249823,
    latitude: 38.48103761,
    zoom: 3.88091657,
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
