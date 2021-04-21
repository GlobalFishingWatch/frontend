import React, { useCallback, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import { DatasetCategory } from '@globalfishingwatch/api-types'
import { selectContextAreasDataviews } from 'features/dataviews/dataviews.selectors'
import styles from 'features/workspace/shared/Sections.module.css'
import NewDatasetTooltip from 'features/datasets/NewDatasetTooltip'
import TooltipContainer from 'features/workspace/shared/TooltipContainer'
import LayerPanel from './ContextAreaLayerPanel'

function ContextAreaSection(): React.ReactElement {
  const { t } = useTranslation()
  const [newDatasetOpen, setNewDatasetOpen] = useState(false)

  const dataviews = useSelector(selectContextAreasDataviews)
  const hasVisibleDataviews = dataviews?.some((dataview) => dataview.config?.visible === true)

  const onAddClick = useCallback(() => {
    setNewDatasetOpen(true)
  }, [])

  return (
    <div className={cx(styles.container, { 'print-hidden': !hasVisibleDataviews })}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>{t('common.context_area_plural', 'Context areas')}</h2>
        <TooltipContainer
          visible={newDatasetOpen}
          onClickOutside={() => {
            setNewDatasetOpen(false)
          }}
          component={
            <NewDatasetTooltip
              datasetCategory={DatasetCategory.Context}
              onSelect={() => setNewDatasetOpen(false)}
            />
          }
        >
          <IconButton
            icon="plus"
            type="border"
            size="medium"
            tooltip={t('dataset.addContext', 'Add context dataset')}
            tooltipPlacement="top"
            className="print-hidden"
            onClick={onAddClick}
          />
        </TooltipContainer>
      </div>
      {dataviews?.map((dataview) => (
        <LayerPanel key={dataview.id} dataview={dataview} />
      ))}
    </div>
  )
}

export default ContextAreaSection
