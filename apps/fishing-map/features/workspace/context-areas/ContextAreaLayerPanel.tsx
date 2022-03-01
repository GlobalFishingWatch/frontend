import React, { useState, useCallback } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import ReactHtmlParser from 'react-html-parser'
import { DatasetTypes, DatasetStatus, DatasetCategory } from '@globalfishingwatch/api-types'
import { Tooltip, ColorBarOption, Modal } from '@globalfishingwatch/ui-components'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useAddDataset, useAutoRefreshImportingDataset } from 'features/datasets/datasets.hook'
import { isGuestUser } from 'features/user/user.slice'
import DatasetLoginRequired from 'features/workspace/shared/DatasetLoginRequired'
import { PRIVATE_SUFIX, ROOT_DOM_ELEMENT } from 'data/config'
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

const DATASOURCE_WARNING = ['public-eez-land', 'public-mpa-all']

function LayerPanel({ dataview, onToggle }: LayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const [colorOpen, setColorOpen] = useState(false)
  const [modalDataWarningOpen, setModalDataWarningOpen] = useState(false)
  const onDataWarningModalClose = useCallback(() => {
    setModalDataWarningOpen(false)
  }, [setModalDataWarningOpen])
  const guestUser = useSelector(isGuestUser)
  const onAddNewClick = useAddDataset({ datasetCategory: DatasetCategory.Context })

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
  const isUserLayer = !guestUser && dataset?.ownerType === 'user'

  useAutoRefreshImportingDataset(dataset, 5000)

  if (!dataset) {
    const dataviewHasPrivateDataset = dataview.datasetsConfig?.some((d) =>
      d.datasetId.includes(PRIVATE_SUFIX)
    )
    return guestUser && dataviewHasPrivateDataset ? (
      <DatasetLoginRequired dataview={dataview} />
    ) : (
      <DatasetNotFound dataview={dataview} />
    )
  }

  const title = t(`datasets:${dataset?.id}.name` as any, dataset?.name || dataset?.id)

  const TitleComponent = (
    <Title
      title={title}
      className={styles.name}
      classNameActive={styles.active}
      dataview={dataview}
      onToggle={onToggle}
    />
  )

  return (
    <div
      className={cx(styles.LayerPanel, {
        [styles.expandedContainerOpen]: colorOpen,
        'print-hidden': !layerActive,
      })}
    >
      <div className={styles.header}>
        <LayerSwitch
          disabled={dataset?.status === DatasetStatus.Error}
          active={layerActive}
          className={styles.switch}
          dataview={dataview}
          onToggle={onToggle}
        />
        {title && title.length > 30 ? (
          <Tooltip content={title}>{TitleComponent}</Tooltip>
        ) : (
          TitleComponent
        )}
        <div className={cx('print-hidden', styles.actions, { [styles.active]: layerActive })}>
          {layerActive && (
            <Color
              dataview={dataview}
              open={colorOpen}
              onColorClick={changeColor}
              onToggleClick={onToggleColorOpen}
              onClickOutside={closeExpandedContainer}
            />
          )}
          <InfoModal dataview={dataview} />
          {isUserLayer && <Remove dataview={dataview} />}
        </div>
      </div>
      {layerActive && DATASOURCE_WARNING.includes(dataset?.id) && (
        <div className={cx(styles.properties, styles.dataWarning)}>
          <div>
            {t(
              `datasets.datasetSpecific.${dataset?.id}.dataWarning` as any,
              'This platform uses a reference layer from an external source.'
            )}
          </div>
          <div className={styles.dataWarningLinks}>
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
                  `datasets.datasetSpecific.${dataset?.id}.dataWarningDetail` as any,
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
