import React, { useCallback, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import { DatasetCategory, DatasetTypes } from '@globalfishingwatch/api-types'
import { selectEnvironmentalDataviews } from 'features/dataviews/dataviews.selectors'
import styles from 'features/workspace/shared/Sections.module.css'
import NewDatasetTooltip from 'features/datasets/NewDatasetTooltip'
import TooltipContainer from 'features/workspace/shared/TooltipContainer'
import EnvironmentalLayerPanel from './EnvironmentalLayerPanel'
import UserTrackLayerPanel from './UserTrackLayerPanel'

function EnvironmentalLayerSection(): React.ReactElement | null {
  const { t } = useTranslation()
  const [newDatasetOpen, setNewDatasetOpen] = useState(false)
  const dataviews = useSelector(selectEnvironmentalDataviews)
  const hasVisibleDataviews = dataviews?.some((dataview) => dataview.config?.visible === true)

  const onAddClick = useCallback(() => {
    setNewDatasetOpen(true)
  }, [])

  return (
    <div className={cx(styles.container, { 'print-hidden': !hasVisibleDataviews })}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>{t('common.environment', 'Environment')}</h2>
        <TooltipContainer
          visible={newDatasetOpen}
          onClickOutside={() => {
            setNewDatasetOpen(false)
          }}
          component={
            <NewDatasetTooltip
              datasetCategory={DatasetCategory.Environment}
              onSelect={() => setNewDatasetOpen(false)}
            />
          }
        >
          <IconButton
            icon="plus"
            type="border"
            size="medium"
            tooltip={t('dataset.addEnvironmental', 'Add environmental dataset')}
            tooltipPlacement="top"
            className="print-hidden"
            onClick={onAddClick}
          />
        </TooltipContainer>
      </div>
      {dataviews?.map((dataview) =>
        dataview.datasets && dataview.datasets[0].type === DatasetTypes.UserTracks ? (
          <UserTrackLayerPanel key={dataview.id} dataview={dataview} />
        ) : (
          <EnvironmentalLayerPanel key={dataview.id} dataview={dataview} />
        )
      )}
    </div>
  )
}

export default EnvironmentalLayerSection
