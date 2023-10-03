import { Dataview, DataviewCategory } from '@globalfishingwatch/api-types'

export const dataviews: Dataview[] = [{
  "id": 345,
  "name": "SAR",
  "slug": "sar",
  "description": "SAR",
  "app": "fishing-map",
  "config": {
      "type": "HEATMAP_ANIMATED",
      "color": "#9CA4FF",
      "maxZoom": 12,
      "datasets": [
          "public-global-sar-presence:v20231002"
      ],
      "colorRamp": "lilac"
  },
  "filtersConfig": {
      "order": [
          "matched",
          "flag",
          "shiptype",
          "neural_vessel_type",
          "geartype"
      ],
      "incompatibility": {
          "public-global-sar-presence:v20231002": [
              {
                  "id": "matched",
                  "value": "undefined",
                  "disabled": [
                    "flag",
                    "shiptype",
                    "neural_vessel_type",
                    "geartype"
                  ]
              },
              {
                  "id": "matched",
                  "value": false,
                  "disabled": [
                      "flag",
                      "shiptype",
                      "geartype"
                  ]
              },
              {
                  "id": "matched",
                  "value": true,
                  "disabled": [
                      "neural_vessel_type",
                  ]
              }
          ]
      }
  },
  "category": DataviewCategory.Detections,
  "datasetsConfig": [
      {
          "params": [
              {
                  "id": "type",
                  "value": "heatmap"
              }
          ],
          "endpoint": "4wings-tiles",
          "datasetId": "public-global-sar-presence:v20231002"
      },
      {
          "params": [],
          "endpoint": "temporal-context-geojson",
          "datasetId": "public-global-sar-footprints:v20231002"
      }
  ],
  "createdAt": "2023-01-16T15:35:41.689Z",
  "updatedAt": "2023-01-16T15:35:41.689Z"
}]

export default dataviews
