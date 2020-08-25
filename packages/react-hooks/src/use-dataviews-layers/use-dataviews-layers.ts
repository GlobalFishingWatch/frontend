import { useMemo } from 'react'
import { Resource, Dataview } from '@globalfishingwatch/dataviews-client'
import { Generators } from '@globalfishingwatch/layer-composer'

const API_GATEWAY = 'https://gateway.api.dev.globalfishingwatch.org'

export function getGeneratorConfig(dataview: Dataview) {
  if (dataview.config.type === Generators.Type.UserContext) {
    const dataset = dataview.datasets?.find((dataset) => dataset.type === 'user-context-layer:v1')
    const endpoint = dataset?.endpoints?.find((endpoint) => endpoint.id === 'user-context-tiles')
    if (endpoint) {
      return { ...dataview.config, sourceLayer: dataset?.id, tilesUrl: endpoint.pathTemplate }
    }
  }
  if (dataview.config.type === Generators.Type.Heatmap) {
    // ADHOC CODE FOR AMATHEA UNTIL we:
    // - have support for "proxy" param in temporalgrid
    // - decide how to render different colors by user selection
    const dataset = dataview.datasets?.find((dataset) => dataset.type === '4wings:v1')
    const endpoint = dataset?.endpoints?.find((endpoint) => endpoint.id === '4wings-tiles')
    if (endpoint) {
      return {
        // WORKAROUND UNTIL 4WINGS TYPE IS READY IN LAYER COMPOSER
        type: Generators.Type.GL,
        id: `fourwings-${dataview.id}`,
        sources: [
          {
            maxzoom: 12,
            type: 'vector',
            tiles: [
              API_GATEWAY +
                endpoint.pathTemplate
                  .replace('{{type}}', 'heatmap')
                  .replace(/{{/g, '{')
                  .replace(/}}/g, '}') +
                `?format=mvt&proxy=true&temporal-aggregation=true`,
            ],
          },
        ],
        layers: [
          {
            type: 'fill',
            paint: {
              // 'fill-color': dataview.defaultView?.color,
              'fill-color': [
                'interpolate',
                ['linear'],
                ['to-number', ['get', 'count']],
                0,
                '#002457',
                300,
                '#163F89',
                1000,
                '#0F6F97',
                3000,
                '#07BBAE',
                56000,
                '#00FFC3',
                146000,
                '#FFFFFF',
              ],
            },
            'source-layer': dataset?.id,
          },
        ],
      }
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
      const datasetParams = dataview.datasetsConfig[dataview.id].params.find((datasetParams) => {
        return datasetParams.id && datasetParams.id === resource.datasetParamId
      })
      return datasetParams
    })

    if (dataview.datasetsConfig) {
      Object.entries(dataview.datasetsConfig).forEach(([key, value]) => {
        generatedUidComponents.push(key)
        generatedUidComponents.push(...value.params.map((p) => p.id))
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
