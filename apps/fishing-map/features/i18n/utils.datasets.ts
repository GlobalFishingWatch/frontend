import { removeDatasetPrefix, removeDatasetVersion } from '@globalfishingwatch/datasets-client'

import type { GetDatasetLabelParams } from 'features/datasets/datasets.utils'
import i18n, { t } from 'features/i18n/i18n'

export const getDatasetNameTranslated = (dataset = {} as GetDatasetLabelParams): string => {
  const datasetIdWithoutVersion = removeDatasetVersion(dataset?.id)
  if (datasetIdWithoutVersion && i18n.exists(`datasets:${datasetIdWithoutVersion}.name`)) {
    return t((t) => t[datasetIdWithoutVersion].name, { ns: 'datasets' })
  }

  const datasetIdWithoutPrefix = removeDatasetPrefix(dataset?.id)
  if (datasetIdWithoutPrefix && i18n.exists(`datasets:${datasetIdWithoutPrefix}.name`)) {
    return t((t) => t[datasetIdWithoutPrefix].name, { ns: 'datasets' })
  }

  return dataset?.name || dataset?.id || ''
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
