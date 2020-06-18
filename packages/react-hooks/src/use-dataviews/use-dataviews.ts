import { useMemo } from 'react'
import { Resource, ResolvedDataview } from '@globalfishingwatch/dataviews-client'
import { Generators } from '@globalfishingwatch/layer-composer'

/**
 * Generates generator configs to be consumed by LayerComposer, based on the list of dataviews provided,
 * and associates Resources to them when needed for the generator (ie tracks data for a track generator).
 * If workspace is provided, it will only use the dataviews specified in the Workspace,
 * and apply any viewParams or datasetParams from it.
 * @param dataviews
 * @param resources
 */
const useDataviews = (
  dataviews: ResolvedDataview[],
  ressources: Resource[]
): Generators.AnyGeneratorConfig[] => {
  const generators = useMemo(() => {
    return dataviews.map((dataview) => {
      const dataviewResource = resources.find((resource) => {
        if (resource.dataviewId !== dataview.id) return false
        const matchedDatasetParamId = dataview.datasetsParamIds.find(
          (datasetParamId: string | number) => datasetParamId === resource.datasetParamId
        )
        return matchedDatasetParamId
      })

      const generatorConfig: Generators.AnyGeneratorConfig = {
        id: dataview.uid,
        ...dataview.view,
      } as Generators.AnyGeneratorConfig
      if (dataviewResource && dataviewResource.data) {
        generatorConfig.data = dataviewResource.data as Generators.AnyData
      }
      return generatorConfig
    })
  }, [dataviews, resources])
  return generators
}

export default useDataviews
