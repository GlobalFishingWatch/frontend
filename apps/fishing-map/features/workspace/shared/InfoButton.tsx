import { useTranslation } from 'react-i18next'

import { DatasetStatus } from '@globalfishingwatch/api-types'
import { getDatasetConfiguration } from '@globalfishingwatch/datasets-client'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { IconButton } from '@globalfishingwatch/ui-components'

import { useSidePanel } from 'features/content/contentPanel.hooks'

type InfoButtonProps = {
  dataview: UrlDataviewInstance
  onClick?: (e: React.MouseEvent) => void
  className?: string
  showAllDatasets?: boolean
  onModalStateChange?: (open: boolean) => void
}

const InfoButton = ({ dataview, className }: InfoButtonProps) => {
  const { openSidePanel } = useSidePanel()

  const { t } = useTranslation()
  const dataset = dataview.datasets?.[0]

  const datasetImporting = dataset?.status === DatasetStatus.Importing
  const datasetError = dataset?.status === DatasetStatus.Error

  let tooltip: string = t((t) => t.layer.seeDescription)
  const { importLogs = '' } = getDatasetConfiguration(dataset, 'userContextLayerV1')
  const { geometryType } = getDatasetConfiguration(dataset)
  if (datasetImporting) {
    tooltip = t((t) => t.dataset.importing)
  }
  if (datasetError) {
    tooltip = `${t((t) => t.errors.uploadError)} - ${importLogs}`
  }

  if (geometryType === 'draw') {
    return datasetImporting || datasetError ? (
      <IconButton
        size="small"
        icon={'info'}
        type={datasetError ? 'warning' : 'default'}
        loading={datasetImporting}
        className={className}
        tooltip={tooltip}
        tooltipPlacement="top"
      />
    ) : null
  }

  return (
    <IconButton
      icon={datasetError ? 'warning' : 'info'}
      type={datasetError ? 'warning' : 'default'}
      size="small"
      loading={datasetImporting}
      className={className}
      tooltip={tooltip}
      tooltipPlacement="top"
      onClick={() => openSidePanel({ type: 'datasets', id: dataview.id })}
    />
  )
}

export default InfoButton
