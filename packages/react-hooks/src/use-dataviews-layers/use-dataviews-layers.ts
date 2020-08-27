import { useMemo } from 'react'
import { Resource, Dataview } from '@globalfishingwatch/dataviews-client'
import { Generators } from '@globalfishingwatch/layer-composer'

export function getGeneratorConfig(dataview: Dataview) {
  if (dataview.config.type === Generators.Type.UserContext) {
    const dataset = dataview.datasets?.find((dataset) => dataset.type === 'user-context-layer:v1')
    const endpoint = dataset?.endpoints?.find((endpoint) => endpoint.id === 'user-context-tiles')
    if (endpoint) {
      return { ...dataview.config, sourceLayer: dataset?.id, tilesUrl: endpoint.pathTemplate }
    }
  }
  if (dataview.config.type === Generators.Type.Heatmap) {
    const dataset = dataview.datasets?.find((dataset) => dataset.type === '4wings:v1')
    const tilesEndpoint = dataset?.endpoints?.find((endpoint) => endpoint.id === '4wings-tiles')
    const statsEndpoint = dataset?.endpoints?.find(
      (endpoint) => endpoint.id === '4wings-statistics'
    )
    if (tilesEndpoint) {
      const flagFilter = dataview.datasetsConfig?.datasetId?.query.find((q) => q.id === 'flag')
        ?.value
      const generator = {
        id: `fourwings-${dataview.id}`,
        ...dataview.config,
        tileset: dataset?.id as string,
        fetchStats: statsEndpoint !== undefined,
        tilesUrl: tilesEndpoint.pathTemplate,
        statsUrl: statsEndpoint?.pathTemplate,
        // ADHOC for Amathea for now
        ...(flagFilter && { serverSideFilter: `flag in (${flagFilter})` }),
      }
      return generator
    }
  }
  return dataview.config
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
    const generatedUidComponents: (string | number | undefined)[] = [dataview.id, dataview.name]

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
