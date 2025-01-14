import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { SortableContext } from '@dnd-kit/sortable'
import { useCallback } from 'react'
import { IconButton } from '@globalfishingwatch/ui-components'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import styles from 'features/workspace/shared/Sections.module.css'
import { selectEventsDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { useAppDispatch } from 'features/app/app.hooks'
import { setModalOpen } from 'features/modals/modals.slice'
import { selectReadOnly } from 'features/app/selectors/app.selectors'
import LayerPanelContainer from '../shared/LayerPanelContainer'
import LayerPanel from './EventsLayerPanel'

function EventsLayerSection(): React.ReactElement<any> | null {
  const { t } = useTranslation()
  const readOnly = useSelector(selectReadOnly)
  const dataviews = useSelector(selectEventsDataviews)
  const hasVisibleDataviews = dataviews?.some((dataview) => dataview.config?.visible === true)
  const dispatch = useAppDispatch()
  const onAddLayerClick = useCallback(() => {
    dispatch(setModalOpen({ id: 'layerLibrary', open: DataviewCategory.Events }))
  }, [dispatch])

  return (
    <div className={cx(styles.container, { 'print-hidden': !hasVisibleDataviews })}>
      <div className={cx(styles.header, 'print-hidden')}>
        <h2 className={styles.sectionTitle}>{t('common.events', 'Events')}</h2>
        {!readOnly && (
          <div className={cx(styles.sectionButtons)}>
            <IconButton
              icon="plus"
              type="border"
              size="medium"
              tooltip={t('layer.add', 'Add layer')}
              tooltipPlacement="top"
              onClick={() => onAddLayerClick()}
            />
          </div>
        )}
      </div>

      <SortableContext items={dataviews}>
        {dataviews?.map((dataview) => (
          <LayerPanelContainer key={dataview.id} dataview={dataview}>
            <LayerPanel dataview={dataview} />
          </LayerPanelContainer>
        ))}
      </SortableContext>
    </div>
  )
}

export default EventsLayerSection
