import { useMemo } from 'react'
import {
  Resource,
  Dataview,
  DatasetTypes,
  Dataset,
  DataviewDatasetConfig,
  EndpointId,
} from '@globalfishingwatch/api-types'
import { Generators } from '@globalfishingwatch/layer-composer'
import { resolveEndpoint } from '@globalfishingwatch/dataviews-client'

export const resolveDataviewDatasetResource = (
  dataview: Dataview,
  { type, id }: { type?: DatasetTypes; id?: string }
): {
  dataset?: Dataset
  datasetConfig?: DataviewDatasetConfig
  url?: string
} => {
  if (!type && !id) return {}

  const dataset = type
    ? dataview.datasets?.find((dataset) => dataset.type === type)
    : dataview.datasets?.find((dataset) => dataset.id === id)
  if (!dataset) return {}
  const datasetConfig = dataview?.datasetsConfig?.find(
    (datasetConfig) => datasetConfig.datasetId === dataset.id
  )
  if (!datasetConfig) return {}
  const url = resolveEndpoint(dataset, datasetConfig)
  if (!url) return {}

  return { dataset, datasetConfig, url }
}

export function getGeneratorConfig(dataview: Dataview) {
  switch (dataview.config.type) {
    // TODO: remove legacy from Amathea context layers as they support ramps
    case Generators.Type.UserContext: {
      const { dataset, url } = resolveDataviewDatasetResource(dataview, {
        type: DatasetTypes.Context,
      })
      if (!url) {
        console.warn(
          `Missing configuration for ${Generators.Type.UserContext} generator in dataview`,
          dataview
        )
        return
      }
      return {
        ...dataview.config,
        tilesUrl: url,
        metadata: {
          legend: {
            label: dataset?.name,
          },
        },
      }
    }
    case Generators.Type.Heatmap: {
      // TODO support multiple urls in resolveDataviewDatasetResource
      const dataset = dataview.datasets?.find((dataset) => dataset.type === DatasetTypes.Fourwings)
      const tilesEndpoint = dataset?.endpoints?.find(
        (endpoint) => endpoint.id === EndpointId.FourwingsTiles
      )
      const statsEndpoint = dataset?.endpoints?.find(
        (endpoint) => endpoint.id === EndpointId.FourwingsLegend
      )
      if (!tilesEndpoint) {
        console.warn('Missing configuration for heatmap generator in dataview', dataview)
        return
      }
      const id = dataset?.id || dataview.id
      const flagFilter = dataview.config.flagFilter
      const generator = {
        id: `fourwings-${id}`,
        ...dataview.config,
        maxZoom: 8,
        fetchStats: !dataview.config.steps,
        datasets: [dataset?.id],
        tilesUrl: tilesEndpoint.pathTemplate,
        statsUrl: statsEndpoint?.pathTemplate,
        // ADHOC for Amathea for now
        ...(flagFilter && { filters: `flag in ('${flagFilter}')` }),
        metadata: {
          color: dataview?.config?.color,
          legend: {
            label: dataset?.name,
            unit: dataset?.unit,
          },
        },
      }
      return generator
    }
    // TODO: move here Tracks, HeatmapAnimated and Context from fishing map and use this method in both apps
    default:
      return dataview.config
  }
}

/**
 * Generates generator configs to be consumed by LayerComposer, based on the list of dataviews provided,
 * and associates Resources to them when needed for the generator (ie tracks data for a track generator).
 * If workspace is provided, it will only use the dataviews specified in the Workspace,
 * and apply any viewParams or datasetParams from it.
 * @param dataviews
 * @param resources
 */

export function getDataviewsGeneratorConfigs(dataviews: Dataview[], resources?: Resource[]) {
  return dataviews.flatMap((dataview) => {
    const generatedUidComponents: (string | number | undefined)[] = [
      dataview.id,
      dataview.name.replace(/ /g, '_'),
    ]

    const dataviewResource = resources?.find((resource) => {
      if (resource.dataviewId !== dataview.id) return false
      if (!dataview.datasetsConfig) return false
      // TODO once we support multiple datasetsConfig in same dataview
      // const datasetParams = dataview.datasetsConfig[dataview.id].params.find((datasetParams) => {
      //   return datasetParams.id && datasetParams.id === resource.datasetParamId
      // })
      // return datasetParams
      return false
    })

    if (dataview.datasetsConfig) {
      Object.entries(dataview.datasetsConfig).forEach(([key, value]) => {
        generatedUidComponents.push(key)
      })
    }

    const generatorConfig = getGeneratorConfig(dataview)
    if (!generatorConfig) return []

    const generator: Generators.AnyGeneratorConfig = {
      id: generatedUidComponents.filter((component) => component !== undefined).join('_'),
      ...generatorConfig,
    } as Generators.AnyGeneratorConfig

    if (dataviewResource && dataviewResource.data) {
      generatorConfig.data = dataviewResource.data as Generators.AnyData
    }

    return generator
  }) as Generators.AnyGeneratorConfig[]
}

function useDataviewsGeneratorConfigs(dataviews: Dataview[], resources?: Resource[]) {
  const generators = useMemo(() => {
    return getDataviewsGeneratorConfigs(dataviews, resources)
  }, [dataviews, resources])
  return generators
}

export default useDataviewsGeneratorConfigs
