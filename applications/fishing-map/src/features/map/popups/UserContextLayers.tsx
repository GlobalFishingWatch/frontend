import React, { Fragment, useCallback } from 'react'
// import { ContextLayerType } from '@globalfishingwatch/layer-composer/dist/generators/types'
import groupBy from 'lodash/groupBy'
import { batch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import { TooltipEventFeature } from 'features/map/map.hooks'
import { useLocationConnect } from 'routes/routes.hook'
import styles from './Popup.module.css'

type UserContextLayersProps = {
  features: TooltipEventFeature[]
  showFeaturesDetails: boolean
}

function ContextTooltipSection({ features, showFeaturesDetails = false }: UserContextLayersProps) {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()

  const onReportClick = useCallback(
    (feature: TooltipEventFeature) => {
      if (!feature.properties?.gfw_id) {
        console.warn('No gfw_id available in the feature to analyze', feature)
        return
      }

      batch(() => {
        dispatchQueryParams({
          analysis: {
            areaId: feature.properties?.gfw_id,
            sourceId: feature.source,
          },
        })
        // TODO decide if we keep the tooltip open or not
        // dispatch(setClickedEvent(null))
      })
    },
    [dispatchQueryParams]
  )

  const featuresByType = groupBy(features, 'layer')
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
            {featureByType.map((feature) => {
              const { gfw_id } = feature.properties
              return (
                <div className={styles.row} key={`${feature.value}-${gfw_id}`}>
                  <span className={styles.rowText}>{feature.value}</span>
                  {showFeaturesDetails && (
                    <div className={styles.rowActions}>
                      <IconButton
                        icon="report"
                        tooltip={t('common.report', 'Report')}
                        onClick={() => onReportClick && onReportClick(feature)}
                        size="small"
                      />
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
