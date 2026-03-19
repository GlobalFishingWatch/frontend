const openComparisonReport = {
      type: 'WORKSPACE_REPORT',
      payload: {
        category: 'fishing-activity',
        workspaceId: 'default-public',
        datasetId: 'public-eez-areas',
        areaId: '8361',
      },
      meta: {
        query: {
          longitude: -28.09249823,
          latitude: 38.48103761,
          zoom: 4.98397046,
          dataviewInstances: [
            {
              id: 'context-layer-eez',
              config: {
                visible: true,
              },
            },
          ],
          bivariateDataviews: null,
          start: '2025-12-16T00:00:00.000Z',
          end: '2026-03-16T00:00:00.000Z',
          reportComparisonDataviewIds: {
            main: 'ais',
            compare: 'sentinel2__dataset-comparison',
          },
          reportActivityGraph: 'datasetComparison',
          reportCategory: 'activity',
        },
        location: {
          current: {
            pathname: '/fishing-activity/default-public/report/public-eez-areas/8361',
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
              zoom: 4.98397046,
              dataviewInstances: [
                {
                  id: 'context-layer-eez',
                  config: {
                    visible: true,
                  },
                },
              ],
              bivariateDataviews: null,
              start: '2025-12-16T00:00:00.000Z',
              end: '2026-03-16T00:00:00.000Z',
              reportComparisonDataviewIds: {
                main: 'ais',
                compare: 'sentinel2__dataset-comparison',
              },
              reportActivityGraph: 'datasetComparison',
              reportCategory: 'activity',
            },
            search:
              'longitude=-28.09249823&latitude=38.48103761&zoom=4.98397046&dvIn[0][id]=context-layer-eez&dvIn[0][cfg][vis]=true&bDV&start=2025-12-16T00%3A00%3A00.000Z&end=2026-03-16T00%3A00%3A00.000Z&reportComparisonDataviewIds[main]=ais&reportComparisonDataviewIds[compare]=sentinel2__dataset-comparison&rAG=datasetComparison&rC=activity',
          },
          prev: {
            pathname: '',
            type: '',
            payload: {},
          },
          kind: 'load',
        },
      },
      query: {
        longitude: -28.09249823,
        latitude: 38.48103761,
        zoom: 4.98397046,
        dataviewInstances: [
          {
            id: 'context-layer-eez',
            config: {
              visible: true,
            },
          },
        ],
        bivariateDataviews: null,
        start: '2025-12-16T00:00:00.000Z',
        end: '2026-03-16T00:00:00.000Z',
        reportComparisonDataviewIds: {
          main: 'ais',
          compare: 'sentinel2__dataset-comparison',
        },
        reportActivityGraph: 'datasetComparison',
        reportCategory: 'activity',
      },
    }