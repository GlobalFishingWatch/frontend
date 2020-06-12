import { useMemo } from 'react'
import { Resource, DatasetParams } from '@globalfishingwatch/dataviews-client'
import { Generators } from '@globalfishingwatch/layer-composer'
import { AnyGeneratorConfig } from '@globalfishingwatch/layer-composer/dist/generators/types'
import { UniqueDataview } from '../use-workspace'

/**
 * Generates generator configs to be consumed by LayerComposer, based on the list of dataviews provided,
 * and associates Resources to them when needed for the generator (ie tracks data for a track generator).
 * If workspace is provided, it will only use the dataviews specified in the Workspace,
 * and apply any viewParams or datasetParams from it.
 * @param dataviews
 * @param ressources
 */
const useDataviews = (
  dataviews: UniqueDataview[],
  ressources: Resource[]
): Generators.AnyGeneratorConfig[] => {
  const generators = useMemo(() => {
    return dataviews.map((dataview) => {
      const dataviewResource = ressources.find((resource) => {
        if (resource.dataviewId !== dataview.id) return false
        if (!dataview.datasetsParams) return false
        const datasetParams = dataview.datasetsParams.find((datasetParams: DatasetParams) => {
          return datasetParams.id && datasetParams.id === resource.mainDatasetParamId
        })
        return datasetParams
      })

      const generatorConfig: AnyGeneratorConfig = {
        id: dataview.uid,
        ...dataview.view,
      } as AnyGeneratorConfig
      if (dataviewResource && dataviewResource.data) {
        generatorConfig.data = dataviewResource.data as Generators.AnyData
      }
      return generatorConfig
    })
  }, [dataviews, ressources])
  return generators
}

export default useDataviews
