import { LibraryLayerConfig } from 'data/layer-library/layers.types'
import { TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG } from 'data/workspaces'

const heatmapDatasetConfig = {
  params: [
    {
      id: 'type',
      value: 'heatmap',
    },
  ],
  endpoint: '4wings-tiles',
}

export const LAYERS_LIBRARY_ENVIRONMENT: LibraryLayerConfig[] = [
  // {
  //   id: 'gee-water-temperature',
  //   dataviewId: GLOBAL_WATER_TEMPERATURE_DATAVIEW_SLUG,
  //   previewImageUrl:
  //     'https://globalfishingwatch.org/wp-content/uploads/layer-library-temperature-1.jpg',
  // },
  // {
  //   id: 'gee-water-salinity',
  //   dataviewId: GLOBAL_SALINITY_DATAVIEW_SLUG,
  //   previewImageUrl:
  //     'https://globalfishingwatch.org/wp-content/uploads/layer-library-salinity-1.jpg',
  // },
  // {
  //   id: 'gee-chlorophyl',
  //   dataviewId: GLOBAL_CHLOROPHYL_DATAVIEW_SLUG,
  //   previewImageUrl:
  //     'https://globalfishingwatch.org/wp-content/uploads/layer-library-chlorophyl-1.jpg',
  // },
  {
    id: 'chlorophyl',
    dataviewId: TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-chlorophyl-1.jpg',
    config: {
      color: '#FF6854',
      colorRamp: 'red',
    },
    datasetsConfig: [
      {
        ...heatmapDatasetConfig,
        datasetId: 'public-global-chlorophyl:v20231213',
      },
    ],
  },
  {
    id: 'nitrate',
    dataviewId: TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-chlorophyl-1.jpg',
    config: {
      color: '#FF6854',
      colorRamp: 'red',
    },
    datasetsConfig: [
      {
        ...heatmapDatasetConfig,
        datasetId: 'public-global-nitrate:v20231213',
      },
    ],
  },
  {
    id: 'oxygen',
    dataviewId: TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-chlorophyl-1.jpg',
    config: {
      color: '#FF6854',
      colorRamp: 'red',
    },
    datasetsConfig: [
      {
        ...heatmapDatasetConfig,
        datasetId: 'public-global-oxygen:v20231213',
      },
    ],
  },
  {
    id: 'phosphate',
    dataviewId: TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-chlorophyl-1.jpg',
    config: {
      color: '#FF6854',
      colorRamp: 'red',
    },
    datasetsConfig: [
      {
        ...heatmapDatasetConfig,
        datasetId: 'public-global-phosphate:v20231213',
      },
    ],
  },
  {
    id: 'salinity',
    dataviewId: TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-chlorophyl-1.jpg',
    config: {
      color: '#FF6854',
      colorRamp: 'red',
    },
    datasetsConfig: [
      {
        ...heatmapDatasetConfig,
        datasetId: 'public-global-salinity:v20231213',
      },
    ],
  },
  {
    id: 'sst',
    dataviewId: TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-chlorophyl-1.jpg',
    config: {
      color: '#FF6854',
      colorRamp: 'red',
    },
    datasetsConfig: [
      {
        ...heatmapDatasetConfig,
        datasetId: 'public-global-sst:v20231213',
      },
    ],
  },
  {
    id: 'ph',
    dataviewId: TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-chlorophyl-1.jpg',
    config: {
      color: '#FF6854',
      colorRamp: 'red',
      intervals: ['MONTH'],
    },
    datasetsConfig: [
      {
        ...heatmapDatasetConfig,
        datasetId: 'public-global-ph:v20231213',
      },
    ],
  },
  {
    id: 'thgt',
    dataviewId: TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-chlorophyl-1.jpg',
    config: {
      color: '#FF6854',
      colorRamp: 'red',
    },
    datasetsConfig: [
      {
        ...heatmapDatasetConfig,
        datasetId: 'public-global-thgt:v20231213',
      },
    ],
  },
  {
    id: 'sst-anomalies',
    dataviewId: TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-chlorophyl-1.jpg',
    config: {
      color: '#FF6854',
      colorRamp: 'red',
    },
    datasetsConfig: [
      {
        ...heatmapDatasetConfig,
        datasetId: 'public-global-sst-anomalies:v20231213',
      },
    ],
  },
  {
    id: 'sst-anomalies-max',
    dataviewId: TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-chlorophyl-1.jpg',
    config: {
      color: '#FF6854',
      colorRamp: 'red',
    },
    datasetsConfig: [
      {
        ...heatmapDatasetConfig,
        datasetId: 'public-global-sst-anomalies-max:v20231213',
      },
    ],
  },
  {
    id: 'sst-anomalies-min',
    dataviewId: TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-chlorophyl-1.jpg',
    config: {
      color: '#FF6854',
      colorRamp: 'red',
    },
    datasetsConfig: [
      {
        ...heatmapDatasetConfig,
        datasetId: 'public-global-sst-anomalies-min:v20231213',
      },
    ],
  },
]
