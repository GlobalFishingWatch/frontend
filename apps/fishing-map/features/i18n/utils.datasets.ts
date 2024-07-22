import { removeDatasetVersion } from '@globalfishingwatch/datasets-client'
import { GetDatasetLabelParams } from 'features/datasets/datasets.utils'
import { t } from 'features/i18n/i18n'

export const getDatasetNameTranslated = (dataset = {} as GetDatasetLabelParams): string => {
  return t(`datasets:${removeDatasetVersion(dataset?.id)}.name`, dataset?.name || dataset?.id)
}

export const getDatasetDescriptionTranslated = (dataset: {
  id: string
  description?: string
}): string => {
  return t(`datasets:${removeDatasetVersion(dataset?.id)}.description`, dataset?.description || '')
}
