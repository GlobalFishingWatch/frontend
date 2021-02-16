import React, { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import { selectContextAreasDataviews } from 'features/workspace/workspace.selectors'
import styles from 'features/workspace/Sections.module.css'
import { isGuestUser } from 'features/user/user.selectors'
import NewDatasetTooltip from 'features/datasets/NewDatasetTooltip'
import TooltipContainer from '../TooltipContainer'
import LayerPanel from './ContextAreaLayerPanel'

function ContextAreaSection(): React.ReactElement {
  const { t } = useTranslation()
  const [newDatasetOpen, setNewDatasetOpen] = useState(false)

  const dataviews = useSelector(selectContextAreasDataviews)
  const guestuser = useSelector(isGuestUser)
  const onAddClick = useCallback(() => {
    setNewDatasetOpen(true)
  }, [])
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>{t('common.context_area_plural', 'Context areas')}</h2>
        {guestuser ? (
          <IconButton
            icon="plus"
            type="border"
            size="medium"
            disabled
            tooltip={t('dataset.uploadLogin', 'You need to log in to upload datasets')}
            tooltipPlacement="top"
            className="print-hidden"
          />
        ) : (
          <TooltipContainer
            visible={newDatasetOpen}
            onClickOutside={() => {
              setNewDatasetOpen(false)
            }}
            component={<NewDatasetTooltip onSelect={() => setNewDatasetOpen(false)} />}
          >
            <IconButton
              icon="plus"
              type="border"
              size="medium"
              tooltip={t('dataset.add', 'Add dataset')}
              tooltipPlacement="top"
              className="print-hidden"
              onClick={onAddClick}
            />
          </TooltipContainer>
        )}
      </div>
      {dataviews?.map((dataview) => (
        <LayerPanel key={dataview.id} dataview={dataview} />
      ))}
    </div>
  )
}

export default ContextAreaSection
