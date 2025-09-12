import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { SortableContext } from '@dnd-kit/sortable'
import cx from 'classnames'

import { DatasetTypes, DataviewCategory } from '@globalfishingwatch/api-types'
import { getMergedDataviewId, type UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { IconButton } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectReadOnly } from 'features/app/selectors/app.selectors'
import { selectContextAreasDataviewsGrouped } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { setModalOpen } from 'features/modals/modals.slice'
import { selectUserContextDatasets } from 'features/user/selectors/user.permissions.selectors'
import { getEventLabel } from 'utils/analytics'

import LayerPanelContainer from '../shared/LayerPanelContainer'

import LayerPanel from './ContextAreaLayerPanel'

import styles from 'features/workspace/shared/Sections.module.css'

function ContextAreaSection(): React.ReactElement<any> {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const readOnly = useSelector(selectReadOnly)
  const dataviewsGrouped = useSelector(selectContextAreasDataviewsGrouped)
  const allDataviews = Object.values(dataviewsGrouped)
  const dataviews = allDataviews.flat()
  const hasVisibleDataviews = dataviews?.some((dataview) => dataview.config?.visible === true)

  const userDatasets = useSelector(selectUserContextDatasets)

  const onAdd = useCallback(() => {
    trackEvent({
      category: TrackCategory.ReferenceLayer,
      action: `Open panel to add a reference layer`,
      value: userDatasets.length,
    })
    dispatch(setModalOpen({ id: 'layerLibrary', open: DataviewCategory.Context }))
  }, [dispatch, userDatasets.length])

  const onToggleLayer = useCallback(
    (dataview: UrlDataviewInstance) => () => {
      const isVisible = dataview?.config?.visible ?? false
      const dataset = dataview.datasets?.find(
        (d) => d.type === DatasetTypes.Context || d.type === DatasetTypes.UserContext
      )
      const layerTitle = dataset?.name ?? dataset?.id ?? 'Unknown layer'
      const action = isVisible ? 'disable' : 'enable'
      trackEvent({
        category: TrackCategory.ReferenceLayer,
        action: `Toggle reference layer`,
        label: getEventLabel([action, layerTitle]),
      })
    },
    []
  )
  return (
    <div className={cx(styles.container, { 'print-hidden': !hasVisibleDataviews })}>
      <div className={styles.header}>
        <h2 className={cx('print-hidden', styles.sectionTitle)}>
          {t('common.context_area_other')}
        </h2>
        {!readOnly && (
          <IconButton
            icon="plus"
            type="border"
            size="medium"
            tooltip={t('dataset.addContext')}
            tooltipPlacement="top"
            className="print-hidden"
            onClick={onAdd}
          />
        )}
      </div>
      <SortableContext items={allDataviews.flat()}>
        {allDataviews.map((dataviews) => {
          if (!dataviews?.length) return null
          const visibleDataviews = dataviews.filter(
            (dataview) => dataview.config?.visible !== false
          )
          return dataviews?.map((dataview) => (
            <LayerPanelContainer key={dataview.id} dataview={dataview}>
              <LayerPanel
                dataview={dataview}
                onToggle={onToggleLayer(dataview)}
                mergedDataviewId={
                  visibleDataviews?.length ? getMergedDataviewId(visibleDataviews) : undefined
                }
              />
            </LayerPanelContainer>
          ))
        })}
      </SortableContext>
    </div>
  )
}

export default ContextAreaSection
