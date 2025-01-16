import { Fragment, useCallback, useMemo,useState } from 'react'
import { useTranslation } from 'react-i18next'
import { uniqBy } from 'es-toolkit'

import { DatasetStatus, DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { getVesselIdFromDatasetConfig } from '@globalfishingwatch/dataviews-client'
import type { ChoiceOption, SelectOption } from '@globalfishingwatch/ui-components'
import { Choice, IconButton, Modal, Select } from '@globalfishingwatch/ui-components'

import { ROOT_DOM_ELEMENT } from 'data/config'
import DatasetLabel from 'features/datasets/DatasetLabel'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import type { UserGuideSection } from 'features/help/UserGuideLink'
import UserGuideLink from 'features/help/UserGuideLink'
import InfoModalContent from 'features/workspace/common/InfoModalContent'

import styles from './InfoModal.module.css'

type InfoModalProps = {
  dataview: UrlDataviewInstance
  onClick?: (e: React.MouseEvent) => void
  className?: string
  showAllDatasets?: boolean
  onModalStateChange?: (open: boolean) => void
}

const InfoModal = ({
  dataview,
  onClick,
  className,
  onModalStateChange,
  showAllDatasets,
}: InfoModalProps) => {
  const { t } = useTranslation()
  const [modalInfoOpen, setModalInfoOpen] = useState(false)
  const dataset = dataview.datasets?.[0]

  const options = useMemo(() => {
    const uniqDatasets = dataview.datasets ? uniqBy(dataview.datasets, (dataset) => dataset.id) : []
    return uniqDatasets
      .flatMap((dataset) => {
        if (dataview.config?.type === DataviewType.Track) {
          const datasetConfig = dataview.datasetsConfig?.find(
            (datasetConfig) => datasetConfig.datasetId === dataset.id
          )
          if (!datasetConfig) return []
          const hasDatasetVesselId = getVesselIdFromDatasetConfig(datasetConfig)
          if (!hasDatasetVesselId) return []
        } else if (
          !showAllDatasets &&
          dataview.config?.datasets &&
          !dataview.config?.datasets?.includes(dataset.id)
        ) {
          return []
        }
        return {
          id: dataset.id,
          label: <DatasetLabel dataset={dataset} />,
          labelString: getDatasetLabel(dataset),
        }
      })
      .sort((a, b) => a.labelString.localeCompare(b.labelString))
    // Updating options when t changes to ensure the content is updated on lang change
  }, [dataview, t])

  const [activeTab, setActiveTab] = useState<SelectOption | undefined>(options?.[0])
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      setModalInfoOpen(true)
      if (onModalStateChange) onModalStateChange(true)
      if (onClick) {
        onClick(e)
      }
    },
    [onClick, onModalStateChange]
  )
  const onModalClose = useCallback(() => {
    setModalInfoOpen(false)
    if (onModalStateChange) onModalStateChange(false)
  }, [onModalStateChange])

  const isSingleTab = options?.length === 1

  const datasetImporting = dataset?.status === DatasetStatus.Importing
  const datasetError = dataset?.status === DatasetStatus.Error

  let tooltip: string = t(`layer.seeDescription`, 'Click to see layer description')
  if (datasetImporting) {
    tooltip = t('dataset.importing', 'Dataset is being imported')
  }
  if (datasetError) {
    tooltip = `${t('errors.uploadError', 'There was an error uploading your dataset')} - ${
      dataset?.importLogs
    }`
  }
  const selectedDataset = useMemo(
    () => dataview.datasets?.find((d) => d.id === activeTab?.id),
    [dataview.datasets, activeTab]
  )

  if (dataset?.configuration?.geometryType === 'draw') {
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

  let userGuideLink: UserGuideSection | undefined
  if (dataview.category === DataviewCategory.Activity) {
    if (dataview.id.includes('presence')) {
      userGuideLink = 'activityPresence'
    } else {
      userGuideLink = 'activityFishing'
    }
  }
  if (dataview.category === DataviewCategory.Detections) {
    if (dataview.id.includes('viirs')) {
      userGuideLink = 'detectionsVIIRS'
    } else if (dataview.id.includes('sar')) {
      userGuideLink = 'detectionsSAR'
    }
  }

  return (
    <Fragment>
      <IconButton
        icon={datasetError ? 'warning' : 'info'}
        type={datasetError ? 'warning' : 'default'}
        size="small"
        loading={datasetImporting}
        className={className}
        tooltip={tooltip}
        tooltipPlacement="top"
        onClick={handleClick}
      />
      {options && options.length > 0 && modalInfoOpen && (
        <Modal
          appSelector={ROOT_DOM_ELEMENT}
          title={
            <div className={styles.titleContainer}>
              <span className={styles.title}>{isSingleTab ? options[0].label : dataview.name}</span>
              {userGuideLink && <UserGuideLink section={userGuideLink} />}
            </div>
          }
          isOpen={modalInfoOpen}
          onClose={onModalClose}
          contentClassName={styles.modalContent}
        >
          {!isSingleTab && (
            <div className={styles.sourceSelector}>
              {options.length <= 3 ? (
                <Choice
                  options={options}
                  activeOption={activeTab?.id}
                  onSelect={(option) => setActiveTab(option as ChoiceOption)}
                  size="medium"
                />
              ) : (
                <Select
                  options={options}
                  selectedOption={activeTab as SelectOption}
                  onSelect={(option) => setActiveTab(option as SelectOption)}
                />
              )}
            </div>
          )}
          {selectedDataset && <InfoModalContent dataset={selectedDataset} />}
        </Modal>
      )}
    </Fragment>
  )
}

export default InfoModal
