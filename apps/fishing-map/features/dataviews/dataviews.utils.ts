import { kebabCase } from 'lodash'
import {
  ColorCyclingType,
  Dataset,
  Dataview,
  DataviewCategory,
  DataviewDatasetConfig,
  DataviewInstance,
  EndpointId,
} from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { ContextLayerType, GeneratorType } from '@globalfishingwatch/layer-composer'
import { AggregationOperation } from '@globalfishingwatch/fourwings-aggregate'
import {
  TEMPLATE_ACTIVITY_DATAVIEW_SLUG,
  TEMPLATE_ENVIRONMENT_DATAVIEW_SLUG,
  TEMPLATE_CONTEXT_DATAVIEW_SLUG,
  FISHING_DATAVIEW_SLUG,
  TEMPLATE_VESSEL_DATAVIEW_SLUG,
  TEMPLATE_USER_TRACK_SLUG,
  VESSEL_PRESENCE_DATAVIEW_SLUG,
  TEMPLATE_POINTS_DATAVIEW_SLUG,
  TEMPLATE_CLUSTERS_DATAVIEW_SLUG,
} from 'data/workspaces'
import { isPrivateDataset } from 'features/datasets/datasets.utils'

// used in workspaces with encounter events layers
export const ENCOUNTER_EVENTS_SOURCE_ID = 'encounter-events'
export const FISHING_LAYER_PREFIX = 'fishing-'
export const BIG_QUERY_PREFIX = 'bq-'
export const BIG_QUERY_4WINGS_PREFIX = `${BIG_QUERY_PREFIX}4wings-`
export const BIG_QUERY_EVENTS_PREFIX = `${BIG_QUERY_PREFIX}events-`
export const VESSEL_LAYER_PREFIX = 'vessel-'
export const ENVIRONMENTAL_LAYER_PREFIX = 'environment-'
export const CONTEXT_LAYER_PREFIX = 'context-'
export const VESSEL_DATAVIEW_INSTANCE_PREFIX = 'vessel-'

type VesselInstanceDatasets = {
  trackDatasetId?: string
  infoDatasetId?: string
  eventsDatasetsId?: string[]
}

export const getVesselDataviewInstanceDatasetConfig = (
  vesselId: string,
  { trackDatasetId, infoDatasetId, eventsDatasetsId }: VesselInstanceDatasets
) => {
  const datasetsConfig: DataviewDatasetConfig[] = []
  if (infoDatasetId) {
    datasetsConfig.push({
      datasetId: infoDatasetId,
      params: [{ id: 'vesselId', value: vesselId }],
      endpoint: EndpointId.Vessel,
    })
  }
  if (trackDatasetId) {
    datasetsConfig.push({
      datasetId: trackDatasetId,
      params: [{ id: 'vesselId', value: vesselId }],
      endpoint: EndpointId.Tracks,
    })
  }
  if (eventsDatasetsId) {
    eventsDatasetsId.forEach((eventDatasetId) => {
      datasetsConfig.push({
        datasetId: eventDatasetId,
        query: [{ id: 'vessels', value: vesselId }],
        params: [],
        endpoint: EndpointId.Events,
      })
    })
  }
  return datasetsConfig
}

const vesselDataviewInstanceTemplate = (dataviewSlug: Dataview['slug']) => {
  return {
    // TODO find the way to use different vessel dataviews, for example
    // panama and peru doesn't show events and needed a workaround to work with this
    dataviewId: dataviewSlug,
    config: {
      colorCyclingType: 'line' as ColorCyclingType,
    },
  }
}

export const getVesselDataviewInstance = (
  vessel: { id: string },
  datasets: VesselInstanceDatasets
): DataviewInstance<GeneratorType> => {
  const vesselDataviewInstance = {
    id: `${VESSEL_DATAVIEW_INSTANCE_PREFIX}${vessel.id}`,
    ...vesselDataviewInstanceTemplate(TEMPLATE_VESSEL_DATAVIEW_SLUG),
    datasetsConfig: getVesselDataviewInstanceDatasetConfig(vessel.id, datasets),
  }
  return vesselDataviewInstance
}

export const getPresenceVesselDataviewInstance = (
  vessel: { id: string },
  datasets: VesselInstanceDatasets
): DataviewInstance<GeneratorType> => {
  const vesselDataviewInstance = {
    id: `${VESSEL_DATAVIEW_INSTANCE_PREFIX}${vessel.id}`,
    ...vesselDataviewInstanceTemplate(VESSEL_PRESENCE_DATAVIEW_SLUG),
    datasetsConfig: getVesselDataviewInstanceDatasetConfig(vessel.id, datasets),
  }
  return vesselDataviewInstance
}

export const getFishingDataviewInstance = (): DataviewInstance<GeneratorType> => {
  return {
    id: `${FISHING_LAYER_PREFIX}${Date.now()}`,
    config: {
      colorCyclingType: 'fill' as ColorCyclingType,
    },
    dataviewId: FISHING_DATAVIEW_SLUG,
  }
}

export const getEnvironmentDataviewInstance = (
  datasetId: string
): DataviewInstance<GeneratorType> => {
  return {
    id: `${ENVIRONMENTAL_LAYER_PREFIX}${Date.now()}`,
    config: {
      colorCyclingType: 'fill' as ColorCyclingType,
    },
    dataviewId: TEMPLATE_ENVIRONMENT_DATAVIEW_SLUG,
    datasetsConfig: [
      {
        datasetId,
        params: [],
        endpoint: EndpointId.ContextTiles,
      },
    ],
  }
}

export const getUserPointsDataviewInstance = (
  datasetId: string
): DataviewInstance<GeneratorType> => {
  return {
    id: `user-points-${datasetId}`,
    dataviewId: TEMPLATE_POINTS_DATAVIEW_SLUG,
    config: {
      colorCyclingType: 'line' as ColorCyclingType,
    },
    datasetsConfig: [
      {
        datasetId: datasetId,
        endpoint: EndpointId.ContextTiles,
        params: [{ id: 'id', value: datasetId }],
      },
    ],
  }
}

export const getUserTrackDataviewInstance = (dataset: Dataset) => {
  const datasetsConfig = [
    {
      datasetId: dataset.id,
      endpoint: EndpointId.UserTracks,
      params: [{ id: 'id', value: dataset.id }],
    },
  ]
  const dataviewInstance = {
    id: `user-track-${dataset.id}`,
    dataviewId: TEMPLATE_USER_TRACK_SLUG,
    config: {
      colorCyclingType: 'line' as ColorCyclingType,
    },
    datasetsConfig,
  }
  return dataviewInstance
}

export const getContextDataviewInstance = (datasetId: string): DataviewInstance<GeneratorType> => {
  const contextDataviewInstance = {
    id: `${CONTEXT_LAYER_PREFIX}${Date.now()}`,
    category: DataviewCategory.Context,
    config: {
      colorCyclingType: 'line' as ColorCyclingType,
    },
    dataviewId: TEMPLATE_CONTEXT_DATAVIEW_SLUG,
    datasetsConfig: [
      {
        datasetId,
        params: [],
        endpoint: EndpointId.ContextTiles,
      },
    ],
  }
  return contextDataviewInstance
}

export const getDataviewInstanceFromDataview = (dataview: Dataview) => {
  return {
    id: `${kebabCase(dataview.name)}-${Date.now()}`,
    dataviewId: dataview.slug,
  }
}

export const getActivityDataviewInstanceFromDataview = (
  dataview?: Dataview
): DataviewInstance<GeneratorType> | undefined => {
  if (!dataview) return
  const instance = getDataviewInstanceFromDataview(dataview)
  return {
    ...instance,
    config: {
      colorCyclingType: 'fill' as ColorCyclingType,
    },
  }
}

export const getBigQuery4WingsDataviewInstance = (
  datasetId: string,
  { aggregationOperation = AggregationOperation.Sum } = {}
): DataviewInstance<GeneratorType> => {
  const contextDataviewInstance = {
    id: `${BIG_QUERY_4WINGS_PREFIX}${Date.now()}`,
    config: {
      colorCyclingType: 'fill' as ColorCyclingType,
      aggregationOperation,
    },
    dataviewId: TEMPLATE_ACTIVITY_DATAVIEW_SLUG,
    datasetsConfig: [
      {
        datasetId,
        params: [
          {
            id: 'type',
            value: 'heatmap',
          },
        ],
        endpoint: EndpointId.FourwingsTiles,
      },
    ],
  }
  return contextDataviewInstance
}

export const getBigQueryEventsDataviewInstance = (
  datasetId: string
): DataviewInstance<GeneratorType> => {
  const contextDataviewInstance = {
    id: `${BIG_QUERY_EVENTS_PREFIX}${Date.now()}`,
    dataviewId: TEMPLATE_CLUSTERS_DATAVIEW_SLUG,
    datasetsConfig: [
      {
        datasetId,
        params: [],
        endpoint: EndpointId.ClusterTiles,
      },
    ],
  }
  return contextDataviewInstance
}

export const dataviewWithPrivateDatasets = (dataview: UrlDataviewInstance) => {
  const datasets = dataview.datasets || []
  return datasets.some(isPrivateDataset)
}

export const getVesselInWorkspace = (vessels: UrlDataviewInstance[], vesselId: string) => {
  if (!vesselId) return null
  const vesselInWorkspace = vessels.find((v) => {
    const vesselDatasetConfig = v.datasetsConfig?.find(
      (datasetConfig) => datasetConfig.endpoint === EndpointId.Vessel
    )
    const isVesselInEndpointParams = vesselDatasetConfig?.params?.find(
      (p) => p.id === 'vesselId' && p.value === vesselId
    )
    return isVesselInEndpointParams ? v : undefined
  })
  return vesselInWorkspace
}

const RFMO_LINKS: Record<string, string> = {
  'CCSBT Primary Area': 'https://www.ccsbt.org/',
  AIDCP: 'https://www.iattc.org/en-US/AIDCP/About-AIDCP',
  CCAMLR: 'https://www.ccamlr.org/',
  CCBSP: 'https://www.fao.org/fishery/en/organization/rfb/ccbsp',
  CCSBT: 'https://www.ccsbt.org/',
  FFA: 'https://www.ffa.int/',
  GFCM: 'https://www.fao.org/gfcm/en/',
  IATTC: 'https://www.iattc.org/',
  ICCAT: 'https://www.iccat.int/en/',
  ICES: 'https://www.ices.dk/',
  IOTC: 'https://www.iotc.org/',
  NAFO: 'https://www.nafo.int/',
  NAMMCO: 'https://nammco.no/',
  NASCO: 'https://www.nasco.int/',
  NEAFC: 'https://www.neafc.org/',
  NPAFC: 'https://npafc.org/',
  NPFC: 'https://www.npfc.int/',
  PICES: 'https://meetings.pices.int/',
  SEAFDEC: 'https://www.seafdec.org/',
  SEAFO: 'https://www.seafo.org/',
  SIOFA: 'https://www.apsoi.org/',
  SPC: 'https://www.spc.int/',
  SPRFMO: 'https://www.sprfmo.int/',
  WCPFC: 'https://www.wcpfc.int/',
}

export const getContextAreaLink = (generatorContextLayer: ContextLayerType, id: string) => {
  let linkHref = undefined
  switch (generatorContextLayer) {
    case ContextLayerType.MPA:
    case ContextLayerType.MPANoTake:
    case ContextLayerType.MPARestricted:
      linkHref = `https://www.protectedplanet.net/${id}`
      break
    case ContextLayerType.TunaRfmo:
      linkHref = RFMO_LINKS[id]
      break
    case ContextLayerType.EEZ:
      linkHref = `https://www.marineregions.org/eezdetails.php?mrgid=${id}`
      break
    case ContextLayerType.ProtectedSeas:
      linkHref = `https://mpa.protectedseas.net/index.php?q=${id}`
      break
  }
  return linkHref
}
