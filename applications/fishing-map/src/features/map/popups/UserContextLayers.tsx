import React, { Fragment, useCallback } from 'react'
// import { ContextLayerType } from '@globalfishingwatch/layer-composer/dist/generators/types'
import { groupBy } from 'lodash'
import { batch, useDispatch } from 'react-redux'
import { event as uaEvent } from 'react-ga'
import { TooltipEventFeature } from 'features/map/map.hooks'
import { useLocationConnect } from 'routes/routes.hook'
import { getEventLabel } from 'utils/analytics'
import { setDownloadGeometry } from 'features/download/download.slice'
import { useMapContext } from '../map-context.hooks'
import { setClickedEvent } from '../map.slice'
import styles from './Popup.module.css'
import ContextLayersRow from './ContextLayersRow'
import { useHighlightArea } from './ContextLayers.hooks'

type UserContextLayersProps = {
  features: TooltipEventFeature[]
  showFeaturesDetails: boolean
}

function ContextTooltipSection({ features, showFeaturesDetails = false }: UserContextLayersProps) {
  const dispatch = useDispatch()
  const { eventManager } = useMapContext()
  const { dispatchQueryParams } = useLocationConnect()

  const highlightArea = useHighlightArea()

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
        dispatch(setDownloadGeometry(feature))
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
              const label = feature.value
              const id = `${feature.value}-${gfw_id}-${index}}`
              return (
                <ContextLayersRow
                  id={id}
                  label={label}
                  showFeaturesDetails={showFeaturesDetails}
                  handleDownloadClick={(e) => onDownloadClick(e, feature)}
                  handleReportClick={(e) => onReportClick(e, feature)}
                />
              )
            })}
          </div>
        </div>
      ))}
    </Fragment>
  )
}

export default ContextTooltipSection
