import { Fragment, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { DatasetTypes, DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { getDatasetConfigByDatasetType } from '@globalfishingwatch/dataviews-client'
import { IconButton } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectBivariateDataviews, selectReadOnly } from 'features/app/selectors/app.selectors'
import {
  selectActivityDataviews,
  selectDetectionsDataviews,
} from 'features/dataviews/selectors/dataviews.categories.selectors'
import { setModalOpen } from 'features/modals/modals.slice'
import { ReportCategory } from 'features/reports/reports.types'
import DatasetNotFound from 'features/workspace/shared/DatasetNotFound'
import GlobalReportLink from 'features/workspace/shared/GlobalReportLink'
import { VisualisationChoice } from 'features/workspace/shared/VisualisationChoice'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { getActivityFilters, getActivitySources, getEventLabel } from 'utils/analytics'

import LayerPanelContainer from '../shared/LayerPanelContainer'
import Section from '../shared/Section'

import { useVisualizationsOptions } from './activity.hooks'
import LayerPanel from './ActivityLayerPanel'

import activityStyles from './ActivitySection.module.css'
import { replaceQueryParams } from 'routes/routes.actions'
import styles from 'features/workspace/shared/Section.module.css'

function ActivitySection(): React.ReactElement<any> {
  const { t } = useTranslation()
  const readOnly = useSelector(selectReadOnly)
  const dataviews = useSelector(selectActivityDataviews)
  const visibleDataviews = dataviews?.filter((dataview) => dataview.config?.visible === true)
  const detectionsDataviews = useSelector(selectDetectionsDataviews)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const bivariateDataviews = useSelector(selectBivariateDataviews)

  const { visualizationOptions, activeVisualizationOption, onVisualizationModeChange } =
    useVisualizationsOptions(DataviewCategory.Activity)

  const dispatch = useAppDispatch()

  const onAddLayerClick = useCallback(() => {
    dispatch(setModalOpen({ id: 'layerLibrary', open: DataviewCategory.Activity }))
  }, [dispatch])

  const onBivariateDataviewsClick = useCallback(
    (dataview1: UrlDataviewInstance, dataview2: UrlDataviewInstance) => {
      replaceQueryParams({ bivariateDataviews: [dataview1.id, dataview2.id] })
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
    [dataviews, detectionsDataviews, upsertDataviewInstance]
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
    <Section
      id={DataviewCategory.Activity}
      data-testid="activity-section"
      className="hover-target"
      title={
        <span>
          {t((t) => t.common.activity)}
          {hasVisibleDataviews && (
            <span className={styles.layersCount}>{` (${visibleDataviews.length})`}</span>
          )}
        </span>
      }
      headerOptions={
        !readOnly ? (
          <div className={cx(styles.sectionButtons)}>
            <VisualisationChoice
              options={visualizationOptions}
              testId="activity-visualizations-change"
              activeOption={activeVisualizationOption}
              onSelect={(option) => onVisualizationModeChange(option.id)}
              className={cx({ [styles.hidden]: !hasVisibleDataviews })}
            />
            {hasVisibleDataviews && <GlobalReportLink reportCategory={ReportCategory.Activity} />}
            <IconButton
              icon="plus"
              type="border"
              size="medium"
              tooltip={t((t) => t.layer.add)}
              tooltipPlacement="top"
              onClick={() => onAddLayerClick()}
            />
          </div>
        ) : null
      }
      hasVisibleDataviews={hasVisibleDataviews}
    >
      {dataviews?.map((dataview, index) => {
        const hasDatasetAvailable =
          getDatasetConfigByDatasetType(dataview, DatasetTypes.Fourwings) !== undefined
        const isLastElement = index === dataviews?.length - 1
        const isVisible = dataview?.config?.visible ?? false
        const isNextVisible = dataviews[index + 1]?.config?.visible ?? false
        const showBivariateIcon =
          bivariateDataviews === null && isVisible && isNextVisible && !isLastElement
        return hasDatasetAvailable ? (
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
                  tooltip={t((t) => t.layer.toggleCombinationMode.combine)}
                  tooltipPlacement="top"
                  onClick={() => onBivariateDataviewsClick(dataview, dataviews[index + 1])}
                />
              </div>
            )}
          </Fragment>
        ) : (
          <DatasetNotFound dataview={dataview} />
        )
      })}
    </Section>
  )
}

export default ActivitySection
