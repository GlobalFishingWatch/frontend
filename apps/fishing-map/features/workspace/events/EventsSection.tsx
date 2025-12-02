import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { SortableContext } from '@dnd-kit/sortable'

import { DataviewCategory } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { IconButton } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectReadOnly } from 'features/app/selectors/app.selectors'
import { selectEventsDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { setModalOpen } from 'features/modals/modals.slice'
import { ReportCategory } from 'features/reports/reports.types'
import GlobalReportLink from 'features/workspace/shared/GlobalReportLink'
import { getEventLabel } from 'utils/analytics'

import LayerPanelContainer from '../shared/LayerPanelContainer'
import Section from '../shared/Section'

import LayerPanel from './EventsLayerPanel'

import styles from 'features/workspace/shared/Section.module.css'

function EventsLayerSection(): React.ReactElement<any> | null {
  const { t } = useTranslation()
  const readOnly = useSelector(selectReadOnly)
  const dataviews = useSelector(selectEventsDataviews)
  const visibleDataviews = dataviews?.filter((dataview) => dataview.config?.visible === true)
  const hasVisibleDataviews = visibleDataviews.length >= 1
  const dispatch = useAppDispatch()
  const onAddLayerClick = useCallback(() => {
    dispatch(setModalOpen({ id: 'layerLibrary', open: DataviewCategory.Events }))
  }, [dispatch])

  const onToggleLayer = useCallback(
    (dataview: UrlDataviewInstance) => () => {
      dispatch(setModalOpen({ id: 'typeform', open: true }))
      const isVisible = dataview?.config?.visible ?? false
      const action = isVisible ? 'disable' : 'enable'
      trackEvent({
        category: TrackCategory.ActivityData,
        action: `Toggle ${dataview.category} layer`,
        label: getEventLabel([action, dataview.id]),
      })
    },
    []
  )

  return (
    <Section
      id={DataviewCategory.Events}
      data-testid="events-section"
      title={
        <span>
          {t((t) => t.common.events)}
          {hasVisibleDataviews && (
            <span className={styles.layersCount}>{` (${visibleDataviews.length})`}</span>
          )}
        </span>
      }
      headerOptions={
        !readOnly ? (
          <div className={styles.sectionButtons}>
            {hasVisibleDataviews && <GlobalReportLink reportCategory={ReportCategory.Events} />}
            <IconButton
              icon="plus"
              type="border"
              size="medium"
              tooltip={t((t) => t.layer.add)}
              tooltipPlacement="top"
              onClick={(e) => {
                e.stopPropagation()
                onAddLayerClick()
              }}
            />
          </div>
        ) : null
      }
      hasVisibleDataviews={hasVisibleDataviews}
    >
      <SortableContext items={dataviews}>
        {dataviews?.map((dataview) => (
          <LayerPanelContainer key={dataview.id} dataview={dataview}>
            <LayerPanel dataview={dataview} onToggle={onToggleLayer(dataview)} />
          </LayerPanelContainer>
        ))}
      </SortableContext>
    </Section>
  )
}

export default EventsLayerSection
