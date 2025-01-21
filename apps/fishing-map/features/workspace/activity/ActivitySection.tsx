import { Fragment, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { IconButton } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectBivariateDataviews, selectReadOnly } from 'features/app/selectors/app.selectors'
import { getIsPositionSupportedInDataview } from 'features/dataviews/dataviews.utils'
import {
  selectActivityDataviews,
  selectDetectionsDataviews,
} from 'features/dataviews/selectors/dataviews.categories.selectors'
import { setModalOpen } from 'features/modals/modals.slice'
import { VisualisationChoice } from 'features/workspace/common/VisualisationChoice'
import styles from 'features/workspace/shared/Sections.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useLocationConnect } from 'routes/routes.hook'
import { getActivityFilters, getActivitySources, getEventLabel } from 'utils/analytics'

import LayerPanelContainer from '../shared/LayerPanelContainer'

import { useVisualizationsOptions } from './activity.hooks'
import LayerPanel from './ActivityLayerPanel'

import activityStyles from './ActivitySection.module.css'

function ActivitySection(): React.ReactElement<any> {
  const { t } = useTranslation()
  const readOnly = useSelector(selectReadOnly)
  const dataviews = useSelector(selectActivityDataviews)
  const detectionsDataviews = useSelector(selectDetectionsDataviews)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { dispatchQueryParams } = useLocationConnect()
  const bivariateDataviews = useSelector(selectBivariateDataviews)

  const positionsSupported = dataviews.every((dataview) =>
    getIsPositionSupportedInDataview(dataview)
  )

  const { visualizationOptions, activeVisualizationOption, onVisualizationModeChange } =
    useVisualizationsOptions(DataviewCategory.Activity)

  const dispatch = useAppDispatch()

  const onAddLayerClick = useCallback(() => {
    dispatch(setModalOpen({ id: 'layerLibrary', open: DataviewCategory.Activity }))
  }, [dispatch])

  const onBivariateDataviewsClick = useCallback(
    (dataview1: UrlDataviewInstance, dataview2: UrlDataviewInstance) => {
      dispatchQueryParams({ bivariateDataviews: [dataview1.id, dataview2.id] })
      // automatically set other animated heatmaps to invisible
      const activityDataviewsToDisable = (dataviews || []).filter(
        (dataview) =>
          dataview.id !== dataview1.id &&
          dataview.id !== dataview2.id &&
          dataview.config?.type === DataviewType.HeatmapAnimated
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

  return (
    <div
      data-test="activity-section"
      className={cx(styles.container, { 'print-hidden': !hasVisibleDataviews }, 'hover-target')}
    >
      <div className={cx(styles.header, 'print-hidden')}>
        <h2 className={styles.sectionTitle}>{t('common.activity', 'Activity')}</h2>
        {!readOnly && (
          <div className={cx(styles.sectionButtons)}>
            {positionsSupported && (
              <VisualisationChoice
                options={visualizationOptions}
                testId="activity-visualizations-change"
                activeOption={activeVisualizationOption}
                onSelect={(option) => onVisualizationModeChange(option.id)}
                className={cx({ [styles.hidden]: !hasVisibleDataviews })}
              />
            )}
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
                isOpen={false}
                onToggle={onToggleLayer(dataview)}
              />
            </LayerPanelContainer>
            {index < dataviews.length - 1 && (
              <div
                className={cx(activityStyles.bivariateToggleContainer, 'print-hidden', {
                  [activityStyles.hidden]: !showBivariateIcon,
                })}
              >
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
