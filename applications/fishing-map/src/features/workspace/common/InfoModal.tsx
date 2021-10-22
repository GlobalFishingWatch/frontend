import { Fragment, useState, useCallback, useMemo } from 'react'
import ReactHtmlParser from 'react-html-parser'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { uniqBy } from 'lodash'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import Tabs, { Tab } from '@globalfishingwatch/ui-components/dist/tabs'
import Modal from '@globalfishingwatch/ui-components/dist/modal'
import { IconButton } from '@globalfishingwatch/ui-components'
import { DatasetStatus } from '@globalfishingwatch/api-types/dist'
import { GeneratorType } from '@globalfishingwatch/layer-composer/dist/generators'
import { getDatasetDescriptionTranslated } from 'features/i18n/utils'
import { getDatasetLabel, hasDatasetConfigVesselData } from 'features/datasets/datasets.utils'
import { isGFWUser } from 'features/user/user.slice'
import styles from './InfoModal.module.css'

type InfoModalProps = {
  dataview: UrlDataviewInstance
  onClick?: (e: React.MouseEvent) => void
  className?: string
  onModalStateChange?: (open: boolean) => void
}

const InfoModal = ({ dataview, onClick, className, onModalStateChange }: InfoModalProps) => {
  const { t } = useTranslation()
  const [modalInfoOpen, setModalInfoOpen] = useState(false)
  const gfwUser = useSelector(isGFWUser)
  const dataset = dataview.datasets?.[0]

  const tabs = useMemo(() => {
    const uniqDatasets = dataview.datasets ? uniqBy(dataview.datasets, (dataset) => dataset.id) : []
    return uniqDatasets.flatMap((dataset) => {
      if (dataview.config?.type === GeneratorType.Track) {
        const datasetConfig = dataview.datasetsConfig?.find(
          (datasetConfig) => datasetConfig.datasetId === dataset.id
        )
        if (!datasetConfig) return []
        const hasDatasetVesselId = hasDatasetConfigVesselData(datasetConfig)
        if (!hasDatasetVesselId) return []
      } else if (dataview.config?.datasets && !dataview.config?.datasets?.includes(dataset.id)) {
        return []
      }
      const description = getDatasetDescriptionTranslated(dataset)
      const rawQueries = dataset.configuration?.documentation?.queries
      const queries = Array.isArray(rawQueries) ? rawQueries : [rawQueries as unknown as string]
      return {
        id: dataset.id,
        title: getDatasetLabel(dataset),
        content: (
          <Fragment>
            <p className={styles.content}>
              {/**
               * For security reasons, we are only parsing html
               * coming from translated descriptions
               **/}
              {description.length > 0 ? ReactHtmlParser(description) : dataset.description}
            </p>
            {gfwUser && (
              <div className={styles.content}>
                <h2 className={styles.subtitle}>Queries used</h2>
                {queries?.length ? (
                  queries?.map((query: string, index: number) => (
                    <div key={index}>
                      <a target="_blank" href={query} rel="noreferrer">
                        query {index + 1}
                      </a>
                    </div>
                  ))
                ) : (
                  <p>none specified</p>
                )}
              </div>
            )}
          </Fragment>
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
  const hasLongTitleTab = tabs.some((tab) => tab.title.length > 30)
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
              buttonSize={hasLongTitleTab ? 'verybig' : 'default'}
            />
          )}
        </Modal>
      )}
    </Fragment>
  )
}

export default InfoModal
