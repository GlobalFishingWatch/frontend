import type { DatasetEventSource } from '@globalfishingwatch/datasets-client'
import { getDatasetSource, removeDatasetVersion } from '@globalfishingwatch/datasets-client'

import type { GetDatasetLabelParams } from 'features/datasets/datasets.utils'
import i18n, { t } from 'features/i18n/i18n'

export const getDatasetNameTranslated = (dataset = {} as GetDatasetLabelParams): string => {
  const datasetId = removeDatasetVersion(dataset?.id)
  if (datasetId && i18n.exists(`datasets:${datasetId}.name`)) {
    return t((t) => t[datasetId].name, { ns: 'datasets' })
  }
  return dataset?.name || datasetId
}

export const getDatasetSourceTranslated = (
  dataset?: GetDatasetLabelParams | GetDatasetLabelParams[]
): DatasetEventSource => {
  if (!dataset) {
    return '' as DatasetEventSource
  }
  const datasets = Array.isArray(dataset) ? dataset : [dataset]

  const hasVMSDatasets = datasets.some((d) => getDatasetSource(d?.id) === 'VMS')
  const hasAISDatasets = datasets.some((d) => getDatasetSource(d?.id) === 'AIS')
  const source =
    hasVMSDatasets && hasAISDatasets
      ? (t((t) => t.common.vmsAndAis) as DatasetEventSource)
      : hasVMSDatasets
        ? t((t) => t.common.vms)
        : hasAISDatasets
          ? t((t) => t.common.ais)
          : ('' as DatasetEventSource)
  return source
}

export const getDatasetDescriptionTranslated = (dataset: {
  id: string
  description?: string
}): string => {
  return (
    t((t) => t[removeDatasetVersion(dataset?.id)]?.description, {
      ns: 'datasets',
      defaultValue: dataset?.description || '',
    })
      // can't understand why i18next introduces an space in the url
      // TODO remove  this ugly fix to remove it
      .replace('https://globalfishingwatch. org/', 'https://globalfishingwatch.org/')
  )
}
