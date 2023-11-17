import { useCallback } from 'react'
import cx from 'classnames'
import { SortableContext } from '@dnd-kit/sortable'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import { DatasetCategory, DatasetTypes } from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { selectContextAreasDataviews } from 'features/dataviews/dataviews.selectors'
import styles from 'features/workspace/shared/Sections.module.css'
import { getEventLabel } from 'utils/analytics'
import { selectReadOnly } from 'features/app/app.selectors'
import { selectUserDatasetsByCategory } from 'features/user/user.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { setModalOpen } from 'features/modals/modals.slice'
import LayerPanelContainer from '../shared/LayerPanelContainer'
import LayerPanel from './ContextAreaLayerPanel'

function ContextAreaSection(): React.ReactElement {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const readOnly = useSelector(selectReadOnly)
  const dataviews = useSelector(selectContextAreasDataviews)
  const hasVisibleDataviews = dataviews?.some((dataview) => dataview.config?.visible === true)

  const userDatasets = useSelector(selectUserDatasetsByCategory(DatasetCategory.Context))

  const onAdd = useCallback(() => {
    trackEvent({
      category: TrackCategory.ReferenceLayer,
      action: `Open panel to add a reference layer`,
      value: userDatasets.length,
    })
    dispatch(setModalOpen({ id: 'layerLibrary', open: true }))
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
          {t('common.context_area_other', 'Context areas')}
        </h2>
        {!readOnly && (
          <IconButton
            icon="plus"
            type="border"
            size="medium"
            tooltip={t('dataset.addContext', 'Add context dataset')}
            tooltipPlacement="top"
            className="print-hidden"
            onClick={onAdd}
          />
        )}
      </div>
      <SortableContext items={dataviews}>
        {dataviews?.map((dataview) => (
          <LayerPanelContainer key={dataview.id} dataview={dataview}>
            <LayerPanel dataview={dataview} onToggle={onToggleLayer(dataview)} />
          </LayerPanelContainer>
        ))}
      </SortableContext>
    </div>
  )
}

export default ContextAreaSection
