import { Fragment, useCallback, useState } from 'react'
import cx from 'classnames'
import { SortableContext } from '@dnd-kit/sortable'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import { DatasetCategory, DatasetTypes } from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { selectContextAreasDataviews } from 'features/dataviews/dataviews.selectors'
import styles from 'features/workspace/shared/Sections.module.css'
import NewDatasetTooltip from 'features/datasets/NewDatasetTooltip'
import TooltipContainer from 'features/workspace/shared/TooltipContainer'
import { getEventLabel } from 'utils/analytics'
import { selectReadOnly } from 'features/app/app.selectors'
import { useMapDrawConnect } from 'features/map/map-draw.hooks'
import { useLocationConnect } from 'routes/routes.hook'
import LoginButtonWrapper from 'routes/LoginButtonWrapper'
import { selectUserDatasetsByCategory } from 'features/user/user.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import LayerPanelContainer from '../shared/LayerPanelContainer'
import LayerPanel from './ContextAreaLayerPanel'

function ContextAreaSection(): React.ReactElement {
  const { t } = useTranslation()
  const { dispatchSetMapDrawing } = useMapDrawConnect()
  const { dispatchQueryParams } = useLocationConnect()

  const readOnly = useSelector(selectReadOnly)
  const dataviews = useSelector(selectContextAreasDataviews)
  const hasVisibleDataviews = dataviews?.some((dataview) => dataview.config?.visible === true)

  const onDrawClick = useCallback(() => {
    dispatchSetMapDrawing(true)
    dispatchQueryParams({ sidebarOpen: false })
    trackEvent({
      category: TrackCategory.ReferenceLayer,
      action: `Draw a custom reference layer - Start`,
    })
  }, [dispatchQueryParams, dispatchSetMapDrawing])

  const [newDatasetOpen, setNewDatasetOpen] = useState(false)
  const userDatasets = useSelector(selectUserDatasetsByCategory(DatasetCategory.Context))
  const onAdd = useCallback(() => {
    trackEvent({
      category: TrackCategory.ReferenceLayer,
      action: `Open panel to upload new reference layer`,
      value: userDatasets.length,
    })
    setNewDatasetOpen(true)
  }, [userDatasets.length])

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
          <Fragment>
            <LoginButtonWrapper
              tooltip={t(
                'layer.drawPolygonLogin',
                'Register and login to draw a layer (free, 2 minutes)'
              )}
            >
              <IconButton
                icon="draw"
                type="border"
                size="medium"
                tooltip={t('layer.drawPolygon', 'Draw a layer')}
                tooltipPlacement="top"
                className="print-hidden"
                onClick={onDrawClick}
              />
            </LoginButtonWrapper>
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
                onClick={onAdd}
              />
            </TooltipContainer>
          </Fragment>
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
