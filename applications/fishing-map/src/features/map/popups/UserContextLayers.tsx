import React, { Fragment, useCallback } from 'react'
// import { ContextLayerType } from '@globalfishingwatch/layer-composer/dist/generators/types'
import { groupBy } from 'lodash'
import { batch, useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { event as uaEvent } from 'react-ga'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import { useFeatureState } from '@globalfishingwatch/react-hooks/dist/use-map-interaction'
import { DEFAULT_CONTEXT_SOURCE_LAYER } from '@globalfishingwatch/layer-composer/dist/generators'
import { TooltipEventFeature } from 'features/map/map.hooks'
import { useLocationConnect } from 'routes/routes.hook'
import { CONTEXT_LAYER_PREFIX } from 'features/dataviews/dataviews.utils'
import { selectHasAnalysisLayersVisible } from 'features/dataviews/dataviews.selectors'
import { getEventLabel } from 'utils/analytics'
import { setDownloadActivityGeometry } from 'features/download/downloadActivity.slice'
import useMapInstance, { useMapContext } from '../map-context.hooks'
import { setClickedEvent } from '../map.slice'
import styles from './Popup.module.css'

type UserContextLayersProps = {
  features: TooltipEventFeature[]
  showFeaturesDetails: boolean
}

function ContextTooltipSection({ features, showFeaturesDetails = false }: UserContextLayersProps) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { eventManager } = useMapContext()
  const { dispatchQueryParams } = useLocationConnect()
  const hasAnalysisLayers = useSelector(selectHasAnalysisLayersVisible)
  const { updateFeatureState, cleanFeatureState } = useFeatureState(useMapInstance())

  const highlightArea = useCallback(
    (source: string, id: string) => {
      cleanFeatureState('highlight')
      const featureState = { source, sourceLayer: DEFAULT_CONTEXT_SOURCE_LAYER, id }
      updateFeatureState([featureState], 'highlight')
    },
    [cleanFeatureState, updateFeatureState]
  )

  const onReportClick = useCallback(
    (ev: React.MouseEvent<Element, MouseEvent>, feature: TooltipEventFeature) => {
      eventManager.once('click', (e: any) => e.stopPropagation(), ev.target)
      if (!feature.properties?.gfw_id) {
        console.warn('No gfw_id available in the feature to analyze', feature)
        return
      }
      const areaId = feature.properties?.gfw_id
      const sourceId = feature.source
      dispatchQueryParams({ analysis: { areaId, sourceId } })
      highlightArea(sourceId, areaId)
      uaEvent({
        category: 'Analysis',
        action: `Open analysis panel`,
        label: getEventLabel([feature.title ?? '', feature.value ?? '']),
      })
    },
    [dispatchQueryParams, highlightArea, eventManager]
  )

  const onDownloadClick = useCallback(
    (ev: React.MouseEvent<Element, MouseEvent>, feature: TooltipEventFeature) => {
      eventManager.once('click', (e: any) => e.stopPropagation(), ev.target)
      if (!feature.properties?.gfw_id) {
        console.warn('No gfw_id available in the feature to analyze', feature)
        return
      }
      batch(() => {
        dispatch(setDownloadActivityGeometry(feature))
        dispatch(setClickedEvent(null))
      })
    },
    [dispatch, eventManager]
  )

  const featuresByType = groupBy(features, 'layerId')
  return (
    <Fragment>
      {Object.values(featuresByType).map((featureByType, index) => (
        <div key={`${featureByType[0].title}-${index}`} className={styles.popupSection}>
          <span
            className={styles.popupSectionColor}
            style={{ backgroundColor: featureByType[0].color }}
          />
          <div className={styles.popupSectionContent}>
            {showFeaturesDetails && (
              <h3 className={styles.popupSectionTitle}>{featureByType[0].title}</h3>
            )}
            {featureByType.map((feature, index) => {
              const { gfw_id } = feature.properties
              const isContextArea = feature.layerId.includes(CONTEXT_LAYER_PREFIX)
              return (
                <div className={styles.row} key={`${feature.value}-${gfw_id}-${index}}`}>
                  <span className={styles.rowText}>{feature.value ?? feature.title}</span>
                  {showFeaturesDetails && (
                    <div className={styles.rowActions}>
                      {isContextArea && (
                        <Fragment>
                          <IconButton
                            icon="download"
                            disabled={!hasAnalysisLayers}
                            tooltip={t(
                              'download.activityAction',
                              'Download visible activity layers for this area'
                            )}
                            onClick={(e) => onDownloadClick(e, feature)}
                            size="small"
                          />
                          <IconButton
                            icon="report"
                            disabled={!hasAnalysisLayers}
                            tooltip={
                              hasAnalysisLayers
                                ? t('common.analysis', 'Create an analysis for this area')
                                : t(
                                    'common.analysisNotAvailable',
                                    'Toggle an activity or environmenet layer on to analyse in in this area'
                                  )
                            }
                            onClick={(e) => onReportClick(e, feature)}
                            size="small"
                          />
                        </Fragment>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </Fragment>
  )
}

export default ContextTooltipSection
