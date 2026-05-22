import type { DatasetEventSource } from '@globalfishingwatch/datasets-client'
import { getDatasetSource } from '@globalfishingwatch/datasets-client'

import type { GetDatasetLabelParams } from 'features/datasets/datasets.utils'
import { t } from 'features/i18n/i18n'

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
  return source as DatasetEventSource
}
