import { LayerGroup } from '@globalfishingwatch/deck-layers'

import { PATH_BASENAME } from 'data/config'
import type { LibraryLayerConfig } from 'data/layer-library/layers.types'
import {
  TEMPLATE_GFW_ENVIRONMENT_DATAVIEW_SLUG,
  TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG,
  TEMPLATE_HEATMAP_STATIC_DATAVIEW_SLUG,
} from 'data/workspaces'

const heatmapDatasetConfig = {
  params: [
    {
      id: 'type',
      value: 'heatmap',
    },
  ],
  endpoint: '4wings-tiles',
}

export const BATHYMETRY_DATAVIEW_INSTANCE: Omit<LibraryLayerConfig, 'previewImageUrl'> = {
  id: 'bathymetry',
  dataviewId: TEMPLATE_HEATMAP_STATIC_DATAVIEW_SLUG,
  config: {
    color: 'bathymetry',
    colorRamp: 'bathymetry',
    group: LayerGroup.Bathymetry,
    maxZoom: 8,
  },
  datasetsConfig: [
    {
      ...heatmapDatasetConfig,
      datasetId: 'public-global-bathymetry',
    },
  ],
}

export const LAYERS_LIBRARY_ENVIRONMENT: LibraryLayerConfig[] = [
  // {
  //   id: 'gee-water-temperature',
  //   dataviewId: GLOBAL_WATER_TEMPERATURE_DATAVIEW_SLUG,
  //   previewImageUrl:
  //     `${PATH_BASENAME}/images/layer-library/temperature-1.jpg`,
  // },
  // {
  //   id: 'gee-water-salinity',
  //   dataviewId: GLOBAL_SALINITY_DATAVIEW_SLUG,
  //   previewImageUrl:
  //     `${PATH_BASENAME}/images/layer-library/salinity-1.jpg`,
  // },
  // {
  //   id: 'gee-chlorophyl',
  //   dataviewId: GLOBAL_CHLOROPHYL_DATAVIEW_SLUG,
  //   previewImageUrl:
  //     `${PATH_BASENAME}/images/layer-library/chlorophyl-1.jpg`,
  // },
  {
    ...BATHYMETRY_DATAVIEW_INSTANCE,
    id: 'bathymetry',
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/bathymetry.jpg`,
  },
  // {
  //   id: 'species',
  //   dataviewId: TEMPLATE_HEATMAP_STATIC_DATAVIEW_SLUG,
  //   previewImageUrl: `${PATH_BASENAME}/images/layer-library/species-distribution.jpg`,
  //   config: {
  //     color: '#FFAE9B',
  //     colorRamp: 'salmon',
  //     maxZoom: 5,
  //   },
  //   datasetsConfig: [
  //     {
  //       ...heatmapDatasetConfig,
  //       datasetId: 'public-global-species-mm',
  //     },
  //   ],
  // },
  {
    id: 'chlorophyl',
    dataviewId: TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/chlorophyl.jpg`,
    config: {
      color: '#FFEA00',
      colorRamp: 'yellow',
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
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/nitrate.jpg`,
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
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/oxygen.jpg`,
    config: {
      color: '#00EEFF',
      colorRamp: 'sky',
    },
    datasetsConfig: [
      {
        ...heatmapDatasetConfig,
        datasetId: 'public-global-oxygen:v20231213',
      },
    ],
  },
  {
    id: 'ph',
    dataviewId: TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/ph.jpg`,
    config: {
      color: '#9CA4FF',
      colorRamp: 'lilac',
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
    id: 'phosphate',
    dataviewId: TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/phosphate.jpg`,
    config: {
      color: '#A6FF59',
      colorRamp: 'green',
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
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/salinity.jpg`,
    config: {
      color: '#9CA4FF',
      colorRamp: 'lilac',
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
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/temperature.jpg`,
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
    id: 'sst-anomalies',
    dataviewId: TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/sst-anomalies-mean.jpg`,
    config: {
      color: '#FFAA0D',
      colorRamp: 'orange',
    },
    datasetsConfig: [
      {
        ...heatmapDatasetConfig,
        datasetId: 'public-global-sst-anomalies:v20231213',
      },
    ],
  },
  {
    id: 'sst-anomalies-min',
    dataviewId: TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/sst-anomalies-min.jpg`,
    config: {
      color: '#FFEA00',
      colorRamp: 'yellow',
    },
    datasetsConfig: [
      {
        ...heatmapDatasetConfig,
        datasetId: 'public-global-sst-anomalies-min:v20231213',
      },
    ],
  },
  {
    id: 'sst-anomalies-max',
    dataviewId: TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/sst-anomalies-max.jpg`,
    config: {
      color: '##FF6854',
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
    id: 'thgt',
    dataviewId: TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/thgt.jpg`,
    config: {
      color: '#FFAE9B',
      colorRamp: 'salmon',
    },
    datasetsConfig: [
      {
        ...heatmapDatasetConfig,
        datasetId: 'public-global-thgt:v20231213',
      },
    ],
  },
  {
    id: 'marine-ecoregions',
    dataviewId: TEMPLATE_GFW_ENVIRONMENT_DATAVIEW_SLUG,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/marine-ecoregions.jpg`,
    config: {
      color: '#4184F4',
    },
    datasetsConfig: [
      {
        params: [],
        endpoint: 'context-tiles',
        datasetId: 'public-marine-ecoregions',
      },
    ],
  },
  {
    id: 'mangroves',
    dataviewId: TEMPLATE_GFW_ENVIRONMENT_DATAVIEW_SLUG,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/mangroves.jpg`,
    config: {
      color: '#A6FF59',
    },
    datasetsConfig: [
      {
        params: [],
        endpoint: 'context-tiles',
        datasetId: 'public-mangroves',
      },
    ],
  },
  {
    id: 'seamounts',
    dataviewId: TEMPLATE_GFW_ENVIRONMENT_DATAVIEW_SLUG,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/seamounts.jpg`,
    config: {
      color: '#00EEFF',
    },
    datasetsConfig: [
      {
        params: [],
        endpoint: 'context-tiles',
        datasetId: 'public-seamounts',
      },
    ],
  },
  {
    id: 'coral-reefs',
    dataviewId: TEMPLATE_GFW_ENVIRONMENT_DATAVIEW_SLUG,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/coral-reefs.jpg`,
    config: {
      color: '#FFAE9B',
    },
    datasetsConfig: [
      {
        params: [],
        endpoint: 'context-tiles',
        datasetId: 'public-coral-reefs',
      },
    ],
  },
  {
    id: 'seagrasses',
    dataviewId: TEMPLATE_GFW_ENVIRONMENT_DATAVIEW_SLUG,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/seagrasses.jpg`,
    config: {
      color: '#FFEA00',
    },
    datasetsConfig: [
      {
        params: [],
        endpoint: 'context-tiles',
        datasetId: 'public-seagrasses',
      },
    ],
  },
]
