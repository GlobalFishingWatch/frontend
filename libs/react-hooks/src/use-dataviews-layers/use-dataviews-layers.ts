import { useMemo } from 'react'
import { getDataviewsGeneratorConfigs } from '@globalfishingwatch/dataviews-client'

export const useDataviewsGeneratorConfigs: typeof getDataviewsGeneratorConfigs = (
  dataviews,
  params,
  resources
) => {
  const generators = useMemo(() => {
    return getDataviewsGeneratorConfigs(dataviews, params, resources)
  }, [dataviews, params, resources])
  return generators
}
