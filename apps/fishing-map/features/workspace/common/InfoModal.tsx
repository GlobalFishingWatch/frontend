import { Fragment, useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { uniqBy } from 'es-toolkit'
import {
  getVesselIdFromDatasetConfig,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import { Tabs, Tab, Modal, IconButton } from '@globalfishingwatch/ui-components'
import { DatasetStatus, DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'
import InfoModalContent from 'features/workspace/common/InfoModalContent'
import { ROOT_DOM_ELEMENT } from 'data/config'
import DatasetLabel from 'features/datasets/DatasetLabel'
import UserGuideLink, { UserGuideSection } from 'features/help/UserGuideLink'
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

  const tabs = useMemo(() => {
    const uniqDatasets = dataview.datasets ? uniqBy(dataview.datasets, (dataset) => dataset.id) : []
    return uniqDatasets.flatMap((dataset) => {
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
        title: <DatasetLabel dataset={dataset} />,
        content: <InfoModalContent dataset={dataset} />,
      }
    })
    // Updating tabs when t changes to ensure the content is updated on lang change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataview, t])

  const [activeTab, setActiveTab] = useState<Tab | undefined>(tabs?.[0])
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

  const isSingleTab = tabs?.length === 1

  const datasetImporting = dataset?.status === DatasetStatus.Importing
  const datasetError = dataset?.status === DatasetStatus.Error

  let tooltip = t(`layer.seeDescription`, 'Click to see layer description')
  if (datasetImporting) {
    tooltip = t('dataset.importing', 'Dataset is being imported')
  }
  if (datasetError) {
    tooltip = `${t('errors.uploadError', 'There was an error uploading your dataset')} - ${
      dataset?.importLogs
    }`
  }

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
  const hasLongTitleTab = tabs.some((tab) => (tab.title as any).length > 30)

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
      {tabs && tabs.length > 0 && modalInfoOpen && (
        <Modal
          appSelector={ROOT_DOM_ELEMENT}
          title={
            <div className={styles.titleContainer}>
              <span className={styles.title}>{isSingleTab ? tabs[0].title : dataview.name}</span>
              {userGuideLink && <UserGuideLink section={userGuideLink} />}
            </div>
          }
          isOpen={modalInfoOpen}
          onClose={onModalClose}
          contentClassName={styles.modalContent}
        >
          {isSingleTab ? (
            tabs[0]?.content
          ) : (
            <Tabs
              tabs={tabs}
              activeTab={activeTab?.id}
              onTabClick={(tab: Tab) => setActiveTab(tab)}
              buttonSize={hasLongTitleTab ? 'verybig' : 'default'}
            />
          )}
        </Modal>
      )}
    </Fragment>
  )
}

export default InfoModal
