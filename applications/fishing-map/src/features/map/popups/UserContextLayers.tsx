import React, { Fragment, useCallback } from 'react'
// import { ContextLayerType } from '@globalfishingwatch/layer-composer/dist/generators/types'
import groupBy from 'lodash/groupBy'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import { TooltipEventFeature } from 'features/map/map.hooks'
import { useLocationConnect } from 'routes/routes.hook'
import { CONTEXT_LAYER_PREFIX } from 'features/dataviews/dataviews.utils'
import { selectHasAnalysisLayersVisible } from 'features/dataviews/dataviews.selectors'
import styles from './Popup.module.css'

type UserContextLayersProps = {
  features: TooltipEventFeature[]
  showFeaturesDetails: boolean
}

function ContextTooltipSection({ features, showFeaturesDetails = false }: UserContextLayersProps) {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const hasAnalysisLayers = useSelector(selectHasAnalysisLayersVisible)

  const onReportClick = useCallback(
    (feature: TooltipEventFeature) => {
      if (!feature.properties?.gfw_id) {
        console.warn('No gfw_id available in the feature to analyze', feature)
        return
      }

      dispatchQueryParams({
        analysis: {
          areaId: feature.properties?.gfw_id,
          sourceId: feature.source,
        },
      })
    },
    [dispatchQueryParams]
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
                  <span className={styles.rowText}>{feature.value}</span>
                  {showFeaturesDetails && (
                    <div className={styles.rowActions}>
                      {isContextArea && (
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
                          onClick={() => onReportClick && onReportClick(feature)}
                          size="small"
                        />
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
