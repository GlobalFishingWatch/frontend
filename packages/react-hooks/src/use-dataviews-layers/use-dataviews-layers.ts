import { useMemo } from 'react'
import { getDataviewsGeneratorConfigs } from '@globalfishingwatch/dataviews-client'

const useDataviewsGeneratorConfigs: typeof getDataviewsGeneratorConfigs = (
  dataviews,
  params,
  resources
) => {
  const generators = useMemo(() => {
    return getDataviewsGeneratorConfigs(dataviews, params, resources)
  }, [dataviews, params, resources])
  return generators
}

export default useDataviewsGeneratorConfigs
