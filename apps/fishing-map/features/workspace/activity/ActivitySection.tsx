import { Fragment, useCallback, useMemo, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import { GeneratorType } from '@globalfishingwatch/layer-composer'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import {
  selectActivityDataviews,
  selectAvailableActivityDataviews,
  selectDetectionsDataviews,
} from 'features/dataviews/dataviews.selectors'
import styles from 'features/workspace/shared/Sections.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useLocationConnect } from 'routes/routes.hook'
import {
  getFishingDataviewInstance,
  getActivityDataviewInstanceFromDataview,
} from 'features/dataviews/dataviews.utils'
import { selectBivariateDataviews, selectReadOnly } from 'features/app/app.selectors'
import { getActivityFilters, getActivitySources, getEventLabel } from 'utils/analytics'
import { getDatasetTitleByDataview } from 'features/datasets/datasets.utils'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import TooltipContainer, { TooltipListContainer } from '../shared/TooltipContainer'
import LayerPanelContainer from '../shared/LayerPanelContainer'
import LayerPanel from './ActivityLayerPanel'
import activityStyles from './ActivitySection.module.css'

function ActivitySection(): React.ReactElement {
  const { t } = useTranslation()
  const [addedDataviewId, setAddedDataviewId] = useState<string | undefined>()
  const [newLayerOpen, setNewLayerOpen] = useState<boolean>(false)
  const readOnly = useSelector(selectReadOnly)
  const dataviews = useSelector(selectActivityDataviews)
  const detectionsDataviews = useSelector(selectDetectionsDataviews)
  const activityDataviews = useSelector(selectAvailableActivityDataviews)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { dispatchQueryParams } = useLocationConnect()
  const bivariateDataviews = useSelector(selectBivariateDataviews)

  const addDataviewInstance = useCallback(
    (dataviewInstance: UrlDataviewInstance) => {
      dispatchQueryParams({ bivariateDataviews: undefined })
      upsertDataviewInstance(dataviewInstance)
      setAddedDataviewId(dataviewInstance.id)
    },
    [dispatchQueryParams, upsertDataviewInstance]
  )

  const onAddFishingClick = useCallback(
    (dataviewId?: number) => {
      const dataview = activityDataviews.find((d) => d.id === dataviewId)
      const dataviewInstance = dataview
        ? getActivityDataviewInstanceFromDataview(dataview)
        : getFishingDataviewInstance()
      if (dataviewInstance) {
        addDataviewInstance(dataviewInstance)
      }
    },
    [addDataviewInstance, activityDataviews]
  )

  const onBivariateDataviewsClick = useCallback(
    (dataview1: UrlDataviewInstance, dataview2: UrlDataviewInstance) => {
      dispatchQueryParams({ bivariateDataviews: [dataview1.id, dataview2.id] })
      // automatically set other animated heatmaps to invisible
      const activityDataviewsToDisable = (dataviews || []).filter(
        (dataview) =>
          dataview.id !== dataview1.id &&
          dataview.id !== dataview2.id &&
          dataview.config?.type === GeneratorType.HeatmapAnimated
      )
      const dataviewsToDisable = [...activityDataviewsToDisable, ...detectionsDataviews]
      if (dataviewsToDisable.length) {
        upsertDataviewInstance(
          dataviewsToDisable?.map((dataview) => ({
            id: dataview.id,
            config: {
              visible: false,
            },
          }))
        )
      }
      trackEvent({
        category: TrackCategory.ActivityData,
        action: 'Click on bivariate option',
        label: getEventLabel([
          'combine',
          dataview1.name ?? dataview1.id,
          getActivitySources(dataview1),
          ...getActivityFilters(dataview1.config?.filters),
          dataview2.name ?? dataview2.id,
          getActivitySources(dataview2),
          ...getActivityFilters(dataview2.config?.filters),
        ]),
      })
    },
    [dataviews, detectionsDataviews, dispatchQueryParams, upsertDataviewInstance]
  )

  const onToggleLayer = useCallback(
    (dataview: UrlDataviewInstance) => () => {
      const isVisible = dataview?.config?.visible ?? false
      const action = isVisible ? 'disable' : 'enable'
      trackEvent({
        category: TrackCategory.ActivityData,
        action: `Toggle ${dataview.category} layer`,
        label: getEventLabel([
          action,
          getActivitySources(dataview),
          ...getActivityFilters(dataview.config?.filters),
        ]),
      })
    },
    []
  )
  const hasVisibleDataviews = dataviews?.some((dataview) => dataview.config?.visible === true)
  const activityOptions = useMemo(() => {
    const options = activityDataviews.map((dataview) => {
      const option = {
        id: dataview.id,
        label: getDatasetTitleByDataview(dataview, { withSources: true }),
      }
      return option
    })
    return options.sort((a, b) => a.label.localeCompare(b.label))
  }, [activityDataviews])

  return (
    <div className={cx(styles.container, { 'print-hidden': !hasVisibleDataviews })}>
      <div className={styles.header}>
        <h2 className={cx('print-hidden', styles.sectionTitle)}>
          {t('common.activity', 'Activity')}
        </h2>
        {!readOnly && (
          <div className={cx('print-hidden', styles.sectionButtons)}>
            {activityOptions &&
              (activityOptions.length > 1 ? (
                <TooltipContainer
                  visible={newLayerOpen}
                  onClickOutside={() => {
                    setNewLayerOpen(false)
                  }}
                  component={
                    <TooltipListContainer>
                      {activityOptions.map(({ id, label }) => (
                        <li key={id}>
                          <button onClick={() => onAddFishingClick(id)}>{label}</button>
                        </li>
                      ))}
                    </TooltipListContainer>
                  }
                >
                  <div className={styles.lastBtn}>
                    <IconButton
                      icon="plus"
                      type="border"
                      size="medium"
                      tooltip={t('layer.add', 'Add layer')}
                      tooltipPlacement="top"
                      onClick={() => setNewLayerOpen(true)}
                    />
                  </div>
                </TooltipContainer>
              ) : (
                <IconButton
                  icon="plus"
                  type="border"
                  size="medium"
                  tooltip={t('layer.add', 'Add layer')}
                  tooltipPlacement="top"
                  onClick={() => onAddFishingClick()}
                />
              ))}
          </div>
        )}
      </div>
      {dataviews?.map((dataview, index) => {
        const isLastElement = index === dataviews?.length - 1
        const isVisible = dataview?.config?.visible ?? false
        const isNextVisible = dataviews[index + 1]?.config?.visible ?? false
        const showBivariateIcon =
          bivariateDataviews === undefined && isVisible && isNextVisible && !isLastElement
        return (
          <Fragment key={dataview.id}>
            <LayerPanelContainer key={dataview.id} dataview={dataview}>
              <LayerPanel
                dataview={dataview}
                showBorder={!showBivariateIcon}
                isOpen={dataview.id === addedDataviewId}
                onToggle={onToggleLayer(dataview)}
              />
            </LayerPanelContainer>
            {showBivariateIcon && (
              <div className={cx(activityStyles.bivariateToggleContainer, 'print-hidden')}>
                <IconButton
                  icon={bivariateDataviews ? 'split' : 'compare'}
                  type="border"
                  size="small"
                  className={activityStyles.bivariateToggle}
                  tooltip={t('layer.toggleCombinationMode.combine', 'Combine layers')}
                  tooltipPlacement="top"
                  onClick={() => onBivariateDataviewsClick(dataview, dataviews[index + 1])}
                />
              </div>
            )}
          </Fragment>
        )
      })}
    </div>
  )
}

export default ActivitySection
