import { useState, useCallback } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import ReactHtmlParser from 'react-html-parser'
import { DatasetTypes, DatasetStatus, DatasetCategory } from '@globalfishingwatch/api-types'
import { Tooltip, ColorBarOption, Modal, IconButton } from '@globalfishingwatch/ui-components'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { GeneratorType } from '@globalfishingwatch/layer-composer'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { selectUserId } from 'features/user/user.selectors'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useAddDataset, useAutoRefreshImportingDataset } from 'features/datasets/datasets.hook'
import { isGFWUser, isGuestUser } from 'features/user/user.slice'
import DatasetLoginRequired from 'features/workspace/shared/DatasetLoginRequired'
import { useLayerPanelDataviewSort } from 'features/workspace/shared/layer-panel-sort.hook'
import GFWOnly from 'features/user/GFWOnly'
import { PRIVATE_SUFIX, ROOT_DOM_ELEMENT } from 'data/config'
import { ONLY_GFW_STAFF_DATAVIEWS } from 'data/workspaces'
import { selectBasemapLabelsDataviewInstance } from 'features/dataviews/dataviews.selectors'
import { getDatasetNameTranslated } from 'features/i18n/utils'
import DatasetNotFound from '../shared/DatasetNotFound'
import Color from '../common/Color'
import LayerSwitch from '../common/LayerSwitch'
import Remove from '../common/Remove'
import Title from '../common/Title'
import InfoModal from '../common/InfoModal'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
  onToggle?: () => void
}

const DATAVIEWS_WARNING = ['context-layer-eez', 'context-layer-mpa', 'basemap-labels']

function LayerPanel({ dataview, onToggle }: LayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const [colorOpen, setColorOpen] = useState(false)
  const gfwUser = useSelector(isGFWUser)
  const userId = useSelector(selectUserId)
  const [modalDataWarningOpen, setModalDataWarningOpen] = useState(false)
  const onDataWarningModalClose = useCallback(() => {
    setModalDataWarningOpen(false)
  }, [setModalDataWarningOpen])
  const guestUser = useSelector(isGuestUser)
  const onAddNewClick = useAddDataset({ datasetCategory: DatasetCategory.Context })

  const {
    items,
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    style,
    isSorting,
    activeIndex,
  } = useLayerPanelDataviewSort(dataview.id)

  const layerActive = dataview?.config?.visible ?? true

  const changeColor = (color: ColorBarOption) => {
    upsertDataviewInstance({
      id: dataview.id,
      config: {
        color: color.value,
        colorRamp: color.id,
      },
    })
    setColorOpen(false)
  }
  const onToggleColorOpen = () => {
    setColorOpen(!colorOpen)
  }

  const closeExpandedContainer = () => {
    setColorOpen(false)
  }

  const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.Context)
  const isUserLayer = !guestUser && dataset?.ownerId === userId

  useAutoRefreshImportingDataset(dataset, 5000)

  const basemapLabelsDataviewInstance = useSelector(selectBasemapLabelsDataviewInstance)
  if (!dataset && dataview.id !== basemapLabelsDataviewInstance.id) {
    const dataviewHasPrivateDataset = dataview.datasetsConfig?.some((d) =>
      d.datasetId.includes(PRIVATE_SUFIX)
    )
    return guestUser && dataviewHasPrivateDataset ? (
      <DatasetLoginRequired dataview={dataview} />
    ) : (
      <DatasetNotFound dataview={dataview} />
    )
  }

  const title = dataset
    ? getDatasetNameTranslated(dataset)
    : t(`dataview.${dataview?.id}.title` as any, dataview?.name || dataview?.id)

  const TitleComponent = (
    <Title
      title={title}
      className={styles.name}
      classNameActive={styles.active}
      dataview={dataview}
      onToggle={onToggle}
    />
  )

  const isBasemapLabelsDataview = dataview.config?.type === GeneratorType.BasemapLabels

  return (
    <div
      className={cx(styles.LayerPanel, {
        [styles.expandedContainerOpen]: colorOpen,
        'print-hidden': !layerActive,
      })}
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <div className={styles.header}>
        <LayerSwitch
          disabled={dataset?.status === DatasetStatus.Error}
          active={layerActive}
          className={styles.switch}
          dataview={dataview}
          onToggle={onToggle}
        />
        {ONLY_GFW_STAFF_DATAVIEWS.includes(dataview.dataviewId) && (
          <GFWOnly type="only-icon" style={{ transform: 'none' }} className={styles.gfwIcon} />
        )}
        {title && title.length > 30 ? (
          <Tooltip content={title}>{TitleComponent}</Tooltip>
        ) : (
          TitleComponent
        )}
        <div className={cx('print-hidden', styles.actions, { [styles.active]: layerActive })}>
          {layerActive && !isBasemapLabelsDataview && (
            <Color
              dataview={dataview}
              open={colorOpen}
              onColorClick={changeColor}
              onToggleClick={onToggleColorOpen}
              onClickOutside={closeExpandedContainer}
            />
          )}
          {!isBasemapLabelsDataview && <InfoModal dataview={dataview} />}
          {(isUserLayer || gfwUser) && <Remove dataview={dataview} />}
          {items.length > 1 && (
            <IconButton
              size="small"
              ref={setActivatorNodeRef}
              {...listeners}
              icon="drag"
              className={styles.dragger}
            />
          )}
        </div>
      </div>
      {layerActive && DATAVIEWS_WARNING.includes(dataview?.id) && (
        <div
          className={cx(styles.properties, styles.dataWarning, styles.drag, {
            [styles.dragging]: isSorting && activeIndex > -1,
          })}
        >
          <div>
            {t(
              `dataview.${dataview?.id}.dataWarning` as any,
              'This platform uses a reference layer from an external source.'
            )}
          </div>
          <div className={cx('print-hidden', styles.dataWarningLinks)}>
            <button onClick={onAddNewClick}>{t('dataset.uploadYourOwn', 'Upload your own')}</button>{' '}
            |{' '}
            <button onClick={() => setModalDataWarningOpen(!modalDataWarningOpen)}>
              {t('common.learnMore', 'Learn more')}
            </button>
            <Modal
              appSelector={ROOT_DOM_ELEMENT}
              title={title}
              isOpen={modalDataWarningOpen}
              onClose={onDataWarningModalClose}
              contentClassName={styles.modalContent}
            >
              {ReactHtmlParser(
                t(
                  `dataview.${dataview?.id}.dataWarningDetail` as any,
                  'This platform uses reference layers (shapefiles) from an external source. The designations employed and the presentation of the material on this platform do not imply the expression of any opinion whatsoever on the part of Global Fishing Watch concerning the legal status of any country, territory, city or area or of its authorities, or concerning the delimitation of its frontiers or boundaries. Should you consider these reference layers not applicable for your purposes, this platform allows custom reference layers to be uploaded. Draw or upload your own reference layer using the "+" icon in the left sidebar. Learn more on our <a href="https://globalfishingwatch.org/tutorials/">tutorials</a> and <a href="https://globalfishingwatch.org/help-faqs/">FAQs</a>.'
                )
              )}
            </Modal>
          </div>
        </div>
      )}
    </div>
  )
}

export default LayerPanel
