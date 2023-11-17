import { Fragment, useCallback } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import { GeneratorType } from '@globalfishingwatch/layer-composer'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import {
  selectDetectionsDataviews,
  selectActivityDataviews,
} from 'features/dataviews/dataviews.selectors'
import styles from 'features/workspace/shared/Sections.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useLocationConnect } from 'routes/routes.hook'
import { selectBivariateDataviews, selectReadOnly } from 'features/app/app.selectors'
import { getActivityFilters, getActivitySources, getEventLabel } from 'utils/analytics'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import LayerPanelContainer from '../shared/LayerPanelContainer'
import LayerPanel from '../activity/ActivityLayerPanel'
import activityStyles from '../activity/ActivitySection.module.css'

function DetectionsSection(): React.ReactElement {
  const { t } = useTranslation()
  const readOnly = useSelector(selectReadOnly)
  const dataviews = useSelector(selectDetectionsDataviews)
  const activityDataviews = useSelector(selectActivityDataviews)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { dispatchQueryParams } = useLocationConnect()
  const bivariateDataviews = useSelector(selectBivariateDataviews)

  // const detectionDataviews = useSelector(selectAvailableDetectionsDataviews)
  // const addDataviewInstance = useCallback(
  //   (dataviewInstance: UrlDataviewInstance) => {
  //     dispatchQueryParams({ bivariateDataviews: undefined })
  //     upsertDataviewInstance(dataviewInstance)
  //     setAddedDataviewId(dataviewInstance.id)
  //   },
  //   [dispatchQueryParams, upsertDataviewInstance]
  // )

  const onAddLayerClick = useCallback(() => {
    alert('TODO: INTEGRATE WITH DATASET LIBRARY')
    // const dataview = detectionDataviews.find((d) => d.id === dataviewId)
    // const dataviewInstance = getActivityDataviewInstanceFromDataview(dataview)
    // if (dataviewInstance) {
    //   addDataviewInstance(dataviewInstance)
    // }
  }, [])

  const onBivariateDataviewsClick = useCallback(
    (dataview1: UrlDataviewInstance, dataview2: UrlDataviewInstance) => {
      dispatchQueryParams({ bivariateDataviews: [dataview1.id, dataview2.id] })
      // automatically set other animated heatmaps to invisible
      const detectionsDataviewsToDisable = (dataviews || [])?.filter(
        (dataview) =>
          dataview.id !== dataview1.id &&
          dataview.id !== dataview2.id &&
          dataview.config?.type === GeneratorType.HeatmapAnimated
      )
      const dataviewsToDisable = [...detectionsDataviewsToDisable, ...activityDataviews]
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
    [activityDataviews, dataviews, dispatchQueryParams, upsertDataviewInstance]
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
    <div className={cx(styles.container, { 'print-hidden': !hasVisibleDataviews })}>
      <div className={styles.header}>
        <h2 className={cx('print-hidden', styles.sectionTitle)}>
          {t('common.detections', 'Detections')}
        </h2>
        {!readOnly && (
          <div className={cx('print-hidden', styles.sectionButtons)}>
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

export default DetectionsSection
