import { useSelector, useDispatch } from 'react-redux'
import {
  StyleTransformation,
  sort,
  getInteractiveLayerIds,
  GeneratorType,
} from '@globalfishingwatch/layer-composer'
import {
  BaseUrlWorkspace,
  getRelatedDatasetByType,
  getRelatedDatasetsByType,
  getVesselDataviewInstance,
  stringifyWorkspace,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import { DEFAULT_WORKSPACE, FISHING_MAP_URL, LAST_POSITION_LAYERS_PREFIX } from 'data/config'
import { TEMPLATE_VESSEL_DATAVIEW_ID } from 'features/dataviews/dataviews.config'
import { selectDefaultMapGeneratorsConfig, selectGlobalGeneratorsConfig } from './map.selectors'
import { updateGenerator, UpdateGeneratorPayload } from './map.slice'

// >>> To take into account when implementing useViewport <<<
// j8seangel: This always was an 🤯 let's talk about the latest working solution I found
// using an atom (https://github.com/GlobalFishingWatch/frontend/blob/master/apps/fishing-map/src/features/map/map-viewport.hooks.ts#L26)

const defaultTransformations: StyleTransformation[] = [sort, getInteractiveLayerIds]
const styleTransformations: StyleTransformation[] = [
  ...defaultTransformations,
  (style) => ({
    ...style,
    sprite:
      'https://raw.githubusercontent.com/GlobalFishingWatch/map-gl-sprites/master/out/vessel-viewer',
  }),

  // Move last position layer to top
  (style) => ({
    ...style,
    layers: [
      ...(style.layers?.filter((layer) => !layer.id.startsWith(LAST_POSITION_LAYERS_PREFIX)) ?? []),
      ...(style.layers?.filter((layer) => layer.id.startsWith(LAST_POSITION_LAYERS_PREFIX)) ?? []),
    ],
  }),
]

// This is a convenience hook that returns at the same time the portions of the store we interested in
// as well as the functions we need to update the same portions
export const useGeneratorsConnect = () => {
  const dispatch = useDispatch()
  const generator = {
    globalConfig: useSelector(selectGlobalGeneratorsConfig),
    generatorsConfig: useSelector(selectDefaultMapGeneratorsConfig),
    updateGenerator: (payload: UpdateGeneratorPayload) => dispatch(updateGenerator(payload)),
    styleTransformations,
  }

  return generator
}
export type LatLon = {
  latitude: number
  longitude: number
}
export interface Viewport extends LatLon {
  latitude: number
  longitude: number
  zoom: number
}

export const openFishingMap = (datasets, allGFWIds, viewport) => {
  // colors used in the map
  const colors = ['#f4511f', '#33b679', '#f09300', '#ffea00', '#9ca4ff']
  const presenceDataviews = [
    {
      id: 'fishing-ais',
      config: {
        visible: false,
      },
    },
    {
      id: 'vms',
      config: {
        visible: false,
      },
    },
    {
      id: 'basemap-labels',
      config: {
        visible: true,
        locale: 'en',
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
  ]

  const instances: UrlDataviewInstance<GeneratorType>[] = allGFWIds.map((GFWId, index) => {
    const vesselDataset = decodeURIComponent(GFWId[0])
    const infoDataset = datasets.find((dataset) => dataset.id === vesselDataset)
    const trackDataset = getRelatedDatasetByType(infoDataset, DatasetTypes.Tracks)
    const eventsRelatedDatasets = getRelatedDatasetsByType(infoDataset, DatasetTypes.Events)

    const eventsDatasetsId =
      eventsRelatedDatasets && eventsRelatedDatasets?.length
        ? eventsRelatedDatasets.map((d) => d.id)
        : []

    if (infoDataset || trackDataset) {
      const vesselDataviewInstance = {
        ...getVesselDataviewInstance(
          { id: GFWId[1] },
          {
            trackDatasetId: trackDataset?.id,
            infoDatasetId: infoDataset?.id,

            ...(eventsDatasetsId.length > 0 && { eventsDatasetsId }),
          },
          TEMPLATE_VESSEL_DATAVIEW_ID
        ),

        config: {
          color: colors[index],
        },
      }
      return vesselDataviewInstance
    }
    return null
  })

  const urlJson: BaseUrlWorkspace = {
    latitude: viewport.latitude,
    longitude: viewport.longitude,
    zoom: viewport.zoom,
    start: DEFAULT_WORKSPACE.availableStart,
    end: DEFAULT_WORKSPACE.availableEnd,
    dataviewInstances: [...presenceDataviews, ...instances],
  }

  const url = stringifyWorkspace(urlJson)
  window.open(FISHING_MAP_URL + '?' + url, '_blank').focus()
}
