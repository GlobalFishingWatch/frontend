import { Fragment, useState, useCallback, useMemo } from 'react'
import ReactHtmlParser from 'react-html-parser'
import { useTranslation } from 'react-i18next'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import Tabs, { Tab } from '@globalfishingwatch/ui-components/dist/tabs'
import Modal from '@globalfishingwatch/ui-components/dist/modal'
import { IconButton } from '@globalfishingwatch/ui-components'
import { DatasetStatus } from '@globalfishingwatch/api-types/dist'
import { getDatasetDescriptionTranslated } from 'features/i18n/utils'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import styles from './InfoModal.module.css'

type InfoModalProps = {
  dataview: UrlDataviewInstance
  onClick?: (e: React.MouseEvent) => void
  className?: string
}

const InfoModal = ({ dataview, onClick, className }: InfoModalProps) => {
  const { t } = useTranslation()
  const [modalInfoOpen, setModalInfoOpen] = useState(false)
  const dataset = dataview.datasets?.[0]

  const tabs = useMemo(() => {
    return dataview.datasets?.flatMap((dataset) => {
      if (dataview.config?.datasets && !dataview.config?.datasets?.includes(dataset.id)) {
        return []
      }
      const description = getDatasetDescriptionTranslated(dataset)
      return {
        id: dataset.id,
        title: getDatasetLabel(dataset),
        content: (
          <p className={styles.content}>
            {/**
             * For security reasons, we are only parsing html
             * coming from translated descriptions
             **/}
            {description.length > 0 ? ReactHtmlParser(description) : dataset.description}
          </p>
        ),
      }
    })
    // Updating tabs when t changes to ensure the content is updated on lang change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataview, t])

  const [activeTab, setActiveTab] = useState<Tab | undefined>(tabs?.[0])
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      setModalInfoOpen(true)
      if (onClick) {
        onClick(e)
      }
    },
    [onClick]
  )
  const onModalClose = useCallback(() => {
    setModalInfoOpen(false)
  }, [])

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
      {tabs && tabs.length > 0 && (
        <Modal
          title={isSingleTab ? tabs[0].title : dataview.name}
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
            />
          )}
        </Modal>
      )}
    </Fragment>
  )
}

export default InfoModal
