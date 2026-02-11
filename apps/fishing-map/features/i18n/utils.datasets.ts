import { removeDatasetVersion } from '@globalfishingwatch/datasets-client'

import type { GetDatasetLabelParams } from 'features/datasets/datasets.utils'
import i18n, { t } from 'features/i18n/i18n'

export const getDatasetNameTranslated = (dataset = {} as GetDatasetLabelParams): string => {
  const datasetId = removeDatasetVersion(dataset?.id)
  if (datasetId && i18n.exists(`datasets:${datasetId}.name`)) {
    return t((t) => t[datasetId].name, { ns: 'datasets' })
  }
  return dataset?.name || datasetId
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
