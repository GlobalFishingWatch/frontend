import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { Dataset, DatasetStatus } from '@globalfishingwatch/api-types'

const useDatasetError = (dataset: Dataset | undefined, isCustomUserLayer: boolean) => {
  const { t } = useTranslation()
  return useMemo(() => {
    if (!dataset)
      return { datasetImporting: undefined, datasetError: undefined, infoTooltip: undefined }
    const datasetImporting = dataset.status === DatasetStatus.Importing
    const datasetError = dataset.status === DatasetStatus.Error
    let infoTooltip = isCustomUserLayer
      ? dataset?.description
      : t(`datasets:${dataset?.id}.description` as any)
    if (datasetImporting) {
      infoTooltip = t('dataset.importing', 'Dataset is being imported')
    }
    if (datasetError) {
      infoTooltip = `${t('errors.uploadError', 'There was an error uploading your dataset')} - ${
        dataset.importLogs
      }`
    }
    return { datasetImporting, datasetError, infoTooltip }
  }, [dataset, isCustomUserLayer, t])
}

export default useDatasetError
