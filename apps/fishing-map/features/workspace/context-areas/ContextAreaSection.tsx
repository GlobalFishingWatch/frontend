import { Fragment, useCallback, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { event as uaEvent } from 'react-ga'
import { range, inRange } from 'lodash'
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
import LayerPanelContainer from '../shared/LayerPanelContainer'
import Draggable from '../shared/Draggable'
import LayerPanel from './ContextAreaLayerPanel'

const LAYER_HEIGHT = 40

function ContextAreaSection(): React.ReactElement {
  const { t } = useTranslation()
  const { dispatchSetMapDrawing } = useMapDrawConnect()
  const { dispatchQueryParams } = useLocationConnect()

  const readOnly = useSelector(selectReadOnly)
  const dataviews = useSelector(selectContextAreasDataviews)

  const items = range(dataviews.length)
  const hasVisibleDataviews = dataviews?.some((dataview) => dataview.config?.visible === true)

  const onDrawClick = useCallback(() => {
    dispatchSetMapDrawing(true)
    dispatchQueryParams({ sidebarOpen: false })
    uaEvent({
      category: 'Reference layer',
      action: `Draw a custom reference layer - Start`,
    })
  }, [dispatchQueryParams, dispatchSetMapDrawing])

  const [newDatasetOpen, setNewDatasetOpen] = useState(false)
  const userDatasets = useSelector(selectUserDatasetsByCategory(DatasetCategory.Context))
  const onAdd = useCallback(() => {
    uaEvent({
      category: 'Reference layer',
      action: `Open panel to upload new reference layer`,
      value: userDatasets.length,
    })
    setNewDatasetOpen(true)
  }, [userDatasets.length])

  const onToggleLayer = useCallback(
    (dataview: UrlDataviewInstance) => () => {
      const isVisible = dataview?.config?.visible ?? false
      const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.Context)
      const layerTitle = dataset?.name ?? dataset?.id ?? 'Unknown layer'
      const action = isVisible ? 'disable' : 'enable'
      uaEvent({
        category: 'Reference layer',
        action: `Toggle reference layer`,
        label: getEventLabel([action, layerTitle]),
      })
    },
    []
  )

  const [order, setOrder] = useState(items)
  const [dragOrder, setDragOrder] = useState(items)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleDrag = useCallback(
    ({ translation, id }) => {
      const delta = Math.round(translation.y / LAYER_HEIGHT)
      const index = order.indexOf(id)
      const dragOrder = order.filter((index) => index !== id)

      if (!inRange(index + delta, 0, items.length)) {
        return
      }

      dragOrder.splice(index + delta, 0, id)

      setDraggedIndex(id)
      setDragOrder(dragOrder)
    },
    [items.length, order]
  )

  const handleDragEnd = useCallback(() => {
    setOrder(dragOrder)
    setDraggedIndex(null)
  }, [dragOrder])

  return (
    <div className={cx(styles.container, { 'print-hidden': !hasVisibleDataviews })}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>{t('common.context_area_other', 'Context areas')}</h2>
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
      <div>
        {dataviews?.map((dataview, index) => {
          const isDragging = draggedIndex === index
          const top = dragOrder.indexOf(index) * LAYER_HEIGHT
          const draggedTop = order.indexOf(index) * LAYER_HEIGHT

          return (
            <Draggable key={index} id={index} onDrag={handleDrag} onDragEnd={handleDragEnd}>
              <LayerPanelContainer
                key={dataview.id}
                dataview={dataview}
                draggable
                style={{
                  top: isDragging ? draggedTop : `${top}px`,
                  transition: isDragging ? 'none' : 'all 500ms',
                  position: 'absolute',
                }}
              >
                <LayerPanel dataview={dataview} onToggle={onToggleLayer(dataview)} />
              </LayerPanelContainer>
            </Draggable>
          )
        })}
      </div>
    </div>
  )
}

export default ContextAreaSection
